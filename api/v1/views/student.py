#!/usr/bin/env python3
"""
This module defines routes for managing student records.
"""
from . import app_views
from flask import jsonify, request, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.student import Student
from models.storage import Storage
from flasgger.utils import swag_from
from sqlalchemy.exc import IntegrityError

storage = Storage()
session = storage.get_session()


@app_views.route('/students', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('./documentation/students/create_student.yml')
def create_student():
    """Create a new student record."""
    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    # Validate request data
    required_fields = [
        'first_name',                                                                                                                                                                                     
        'last_name',
        'reg_number'
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Ensure reg_number is unique
    existing_student = session.query(Student).filter_by(reg_number=data['reg_number']).first()
    if existing_student:
        session.close()
        return jsonify({"error": "reg_number must be unique"}), 400
    
    # Create new student instance
    new_student = Student(
        first_name=data['first_name'],
        last_name=data['last_name'],
        reg_number=data['reg_number'],
        middle_name=data.get('middle_name', None)  # Optional field
    )
    
    # Save to database
    try:
        storage.new(new_student)
        storage.save()
    
        return jsonify(
            {
                "student": {
                    "id": new_student.id,
                    "first_name": new_student.first_name,
                    "middle_name": new_student.middle_name,
                    "last_name": new_student.last_name,
                    "reg_number": new_student.reg_number
                },
                "status": "Success",
                "msg": "Student Created Successfully"
            }
        ), 201

    except IntegrityError:
        # Rollback the session if an IntegrityError occurs
        storage.rollback()
        return jsonify(
            {
                'error': 'Student already exists with the provided reg_number'
            }
        ), 409

    except Exception as e:
        # Catch the exception and return the error message as JSON
        return jsonify({"error": str(e)}), 500

    finally:
        storage.close()

@app_views.route('/students/<string:student_id>', methods=['GET'])
@jwt_required()
@swag_from('./documentation/students/get_student.yml')
def get_student(student_id):
    """Retrieve detailed information about a specific student."""
    # Retrieve the student from the database
    student = storage.get_by_id(Student, student_id)

    # If the student doesn't exist, return a 404 error
    if not student:
        storage.close()
        return jsonify({"error": "Student not found"}), 404

    storage.close()
    # Return the student information in JSON format
    return jsonify(student.to_dict()), 200

@app_views.route('/students/<string:student_id>', methods=['DELETE'])
@jwt_required()
@swag_from('./documentation/students/delete_student.yml')
def delete_student(student_id):
    """Delete a specific student by their ID."""
    # Retrieve the student from the database
    student = storage.get_by_id(Student, student_id)

    # If the student doesn't exist, return a 404 error
    if not student:
        storage.close()
        return jsonify({"error": "Student not found"}), 404

    try:
        # Delete the student record from the database
        student_name = student.first_name + " " + student.last_name
        storage.delete(student)
        storage.save()
        return jsonify(
            {
                "status": "Success",
                'message': f'Student {student_name} deleted successfully',
                "id": student.id
            }
        ), 200

    except Exception as e:
        storage.rollback()
        print(str(e))
        return jsonify(
            {
                'error': 'An error occurred while deleting the student',
                'message': str(e)
            }
        ), 500

    finally:
        storage.close()

@app_views.route('/students/<string:student_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@swag_from('./documentation/students/update_student.yml')
def update_student(student_id):
    """Update details of a specific student."""

    data = request.get_json()

    # Validate request data
    if not data:
        return jsonify({'error': 'Request body is empty'}), 400

    # Retrieve the student from the database
    student = storage.get_by_id(Student, student_id)

    # If the student doesn't exist, return a 404 error
    if not student:
        storage.close()
        return jsonify({"error": "Student not found"}), 404

    # Update the student's details with the provided data
    if 'first_name' in data:
        student.first_name = data['first_name']
    if 'last_name' in data:
        student.last_name = data['last_name']
    if 'middle_name' in data:
        student.middle_name = data.get('middle_name', student.middle_name)
    if 'reg_number' in data:

        # Ensure reg_number is unique if it's being changed
        existing_student = session.query(Student).filter_by(reg_number=data['reg_number']).first()
        if existing_student and existing_student.id != student.id:
            session.close()
            return jsonify({"error": "reg_number must be unique"}), 400

        student.reg_number = data['reg_number']

    try:
        # Commit changes to the database
        storage.save()
        return jsonify(
            {
                "student": {
                    "id": student.id,
                    "first_name": student.first_name,
                    "middle_name": student.middle_name,
                    "last_name": student.last_name,
                    "reg_number": student.reg_number
                },
                "status": "Success",
                "msg": "Student Updated Successfully"
            }
        ), 200
    except Exception as e:
        storage.rollback()
        return jsonify(
            {
                'error': 'An error occurred while updating the student',
                'message': str(e)
            }
        ), 500
    finally:
        storage.close()
