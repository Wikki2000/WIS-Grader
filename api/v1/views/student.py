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
        "first_name", "middle_name", "last_name",
        "reg_number", "department", "level"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Ensure reg_number is unique
    existing_student = storage.get_by_field(Student,  "reg_no", data['reg_number'])
    if existing_student:
        storage.close()
        return jsonify({"error": "reg_number must be unique"}), 400
    
    # Create new student instance
    new_student = Student(
        first_name=data['first_name'],
        last_name=data['last_name'],
        reg_number=data['reg_number'],
        middle_name=data.get('middle_name'),  # Optional field
        department=data['department'],
        level=data['level']
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
                    "reg_number": new_student.reg_number,
                    "department": new_student.department,
                    "level": new_student.level
                },
                "courses_enrolled": new_student.courses,
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


@app_views.route('/students')
@jwt_required()
def get_students():
    """Retrieve detailed information about a all student."""
    students = storage.all(Student).values()
    student_list = [
        {
            "student": student.to_dict(), "courses_enrolled": student.courses
        } for student in students
    ]
    return jsonify(student_list), 200


@app_views.route('/students/<string:student_id>', methods=['GET'])
@jwt_required()
@swag_from('./documentation/students/get_student.yml')
def get_student_by_id(student_id):
    """Retrieve detailed information about a specific student."""
    # Retrieve the student from the database
    student = storage.get_by_id(Student, student_id)

    # If the student doesn't exist, return a 404 error
    if not student:
        storage.close()
        abort(404)

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

    try:
        # Commit changes to the database
        for attr, val in data.items():
            if attr != "id":
                setattr(student, attr, val)
        storage.save()
        return jsonify(
            {
                "student": {
                    "id": student.id,
                    "first_name": student.first_name,
                    "middle_name": student.middle_name,
                    "last_name": student.last_name,
                    "reg_number": student.reg_number,
                    "department": student.department,
                    "level": student.level
                },
                "courses_enrolled": student.courses,
                "status": "Success",
                "msg": "Student Created Successfully"
            }
        ), 200
    except Exception as e:
        storage.rollback()
        print(str(e))
        return jsonify(
            {
                'error': 'An error occurred while updating the student',
                'message': str(e)
            }
        ), 500
    finally:
        storage.close()
