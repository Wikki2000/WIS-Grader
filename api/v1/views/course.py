#!/usr/bin/python3
""" Handle course API CRUD operations. """
from . import app_views
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger.utils import swag_from
from flask import request, jsonify
from models.course import Course
from models.lecturer import Lecturer
from models import storage
from sqlalchemy.exc import IntegrityError


@app_views.route('/lecturer/courses', methods=['POST'])
@jwt_required()
@swag_from('./documentation/courses/create_course.yml')
def create_course():
    """
    Create a new course under the lecturer's profile
    retrieved from the JWT token.
    """
    # Retrieve lecturer's ID from the token
    lecturer_id = get_jwt_identity()
    data = request.get_json()

    # Validate request data
    required_fields = [
        'course_title',
        'course_code',
        'credit_load',
        #'semester'
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Check if the lecturer exists
    lecturer = storage.get_by_id(Lecturer, lecturer_id)
    if not lecturer:
        return jsonify({'error': 'Lecturer not found'}), 404

    # Create a new Course instance
    new_course = Course(
        course_title=data['course_title'],
        course_code=data['course_code'],
        credit_load=data['credit_load'],
        #semester=data['semester'],
        lecturer_id=lecturer_id
    )

    try:
        # Add the new course to the database
        storage.new(new_course)
        storage.save()
        return jsonify(
            {
                "course": {
                    "id": new_course.id,
                    "course_name": new_course.course_title,
                    "course_code": new_course.course_code,
                    "credit_load": new_course.credit_load,
                    "lecturer_id": new_course.lecturer_id,
                    "description": new_course.description,
                    "semester": new_course.semester,
                    "student_count": len(new_course.students)
                },
                "status": "Success",
                "msg": "Course Created Successfully"
            }
        ), 201

    except IntegrityError:
        # Rollback the session if an IntegrityError occurs
        storage.rollback()
        return jsonify(
            {
                'error': 'Course already exists with the provided course code'
            }
        ), 409

    except Exception as e:
        # Catch the exception and return the error message as JSON
        return jsonify({"error": str(e)}), 500

    finally:
        storage.close()


@app_views.route('/lecturer/courses', methods=['GET'])
@jwt_required()
@swag_from('./documentation/courses/get_courses.yml')
def get_courses():
    """
    Retrieve all courses created by the authenticated lecturer.
    """
    # Retrieve lecturer's ID from the JWT token
    lecturer_id = get_jwt_identity()

    # Check if the lecturer exists
    lecturer = storage.get_by_id(Lecturer, lecturer_id)
    if not lecturer:
        return jsonify({'error': 'Lecturer not found'}), 404

    # Retrieve all courses associated with the lecturer
    courses = lecturer.courses

    # Convert the list of Course objects to a list of dictionaries
    courses_list = [{
        **course.to_dict(),  # Include all course fields
        'student_count': len(course.students)  # Add student count
    } for course in courses]

    storage.close()
    return jsonify(courses_list), 200


@app_views.route('/courses/<string:course_id>', methods=['DELETE'])
@jwt_required()
@swag_from('./documentation/courses/delete_course.yml')
def delete_course(course_id):
    """
    Delete a specific course by its ID.
    """
    # Check if the course exists
    course = storage.get_by_id(Course,  course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    try:
        # Delete the course from the database
        course_name = course.course_title
        print(course_name)
        storage.delete(course)
        storage.save()
        return jsonify(
            {
                'message': f'Course {course_name} deleted successfully',
                "id": course.id
            }
        ), 200

    except Exception as e:
        storage.rollback()
        print(str(e))
        return jsonify(
            {
                'error': 'An error occurred while deleting the course',
                'message': str(e)
            }
        ), 500


@app_views.route('/courses/<string:course_id>', methods=['PUT'])
@jwt_required()
@swag_from('./documentation/courses/update_course.yml')
def update_course(course_id):
    """
    Update details of a specific course by its ID.
    """
    data = request.get_json()

    # Validate request data
    if not data:
        return jsonify({'error': 'Request body is empty'}), 400

    # Check if the course exists
    course = storage.get_by_id(Course, course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    # Update course details
    if 'course_title' in data:
        course.course_title = data['course_title']
    if 'course_code' in data:
        course.course_code = data['course_code']
    if 'credit_load' in data:
        course.credit_load = data['credit_load']
    if 'semester' in data:
        course.semester = data['semester']

    try:
        # Commit changes to the database
        storage.save()
        return jsonify(
            {
                "id": course.id,
                "course_name": course.course_title,
                "course_code": course.course_code,
                "credit_load": course.credit_load,
                "semester": course.semester,
                "description": course.description
            }
        ), 200

    except Exception as e:
        storage.rollback()
        return jsonify(
            {
                'error': 'An error occurred while updating the course',
                'message': str(e)
            }
        ), 500
    finally:
        storage.close()


@app_views.route('/lecturer/courses/<string:course_id>', methods=['GET'])
@jwt_required()
@swag_from('./documentation/courses/get_course.yml')
def get_course_id(course_id):
    """ Retrieve a course by its ID. """
    # Retrieve lecturer's ID from the JWT token
    lecturer_id = get_jwt_identity()

    # Fetch course from db
    course_obj = storage.get_by_field(Course, "id", course_id)

    if not course_obj:
        abort(404)

    # Return course dic
    course_dict = course_obj.to_dict()
    course_dict['student_count'] = len(course_obj.students)
    return jsonify(course_dict), 200 
