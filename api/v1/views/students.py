#!/usr/bin/env python3
"""
This module defines routes for managing student records.
"""
from . import api_views
from flask import jsonify, request, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.student import Student
from models.user import User
from models import storage
from flasgger.utils import swag_from
from sqlalchemy.exc import IntegrityError
from api.v1.views.utils import bad_request


@api_views.route('/students', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('./documentation/students/create_student.yml')
def create_student():
    """Create a new student record."""
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate request data
    required_fields = [
        "first_name", "middle_name", "last_name",
        "reg_number", "department", "level"
    ]

    error_404_response = bad_request(data, required_fields)
    if error_404_response:
        print(error_404_response)
        return jsonify(error_404_response), 400
    
    data["user_id"] = user_id
    try:
        new_student = Student(**data)
        storage.new(new_student)
        storage.save()
    
        return jsonify(new_student.to_dict())
    except IntegrityError:
        # Rollback the session if an IntegrityError occurs
        storage.rollback()
        msg = (
            f'Student with {data["reg_number"]} with ' +
            'the provided reg_number exist already'
        )
        return jsonify({'error': msg}), 409

    except Exception as e:
        # Catch the exception and return the error message as JSON
        return jsonify({"error": str(e)}), 500

    finally:
        storage.close()


@api_views.route('/students')
@jwt_required()
def get_students():
    """
    Retrieve detailed information about a all student,
    created by a particular lecturer.
    """
    user_id = get_jwt_identity()
    user = storage.get_by(User, id=user_id)
    if not user:
        abort(404)
    try:
        students = user.students
        sorted_students = sorted(students, key=lambda student : student.last_name)
        return jsonify([student.to_dict() for student in sorted_students]), 200
    except Exception as e:
        print(str(e));
        storage.close()
        return jsonify({"error": str(e)}), 500


@api_views.route('/students/<string:student_id>', methods=['GET'])
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


@api_views.route('/students/<string:student_id>', methods=['DELETE'])
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


@api_views.route('/students/<string:student_id>', methods=['PUT'], strict_slashes=False)
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
