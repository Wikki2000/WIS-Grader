#!/usr/bin/python3
""" Handle course API CRUD operations. """
from flask import request, jsonify
from models.course import Course
from models.lecturer import Lecturer
from models.storage import Storage
from . import app_views
from flasgger.utils import swag_from
from flask_jwt_extended import jwt_required, get_jwt_identity

storage = Storage()
session = storage.get_session()


@app_views.route('/lecturer/courses', methods=['POST'])
@swag_from('./documentation/courses/course.yml')
@jwt_required()
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
        'semester'
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Check if the lecturer exists
    lecturer = session.get(Lecturer, lecturer_id)
    if not lecturer:
        return jsonify({'error': 'Lecturer not found'}), 404

    # Check if the course already exists
    existing_course = (
                        session.query(Course)
                        .filter_by(
                                    course_code=data['course_code'],
                                    lecturer_id=lecturer_id
                                    )
                        .first()
                    )
    if existing_course:
        return jsonify(
            {
                'error': 'Course already exists with the provided course code'
            }
        ), 409

    # Create a new Course instance
    new_course = Course(
        course_title=data['course_title'],
        course_code=data['course_code'],
        credit_load=data['credit_load'],
        semester=data['semester'],
        lecturer_id=lecturer_id
    )

    try:
        # Add the new course to the database
        session.add(new_course)
        session.commit()
        return jsonify(
            {
                "id": new_course.id,
                "course_code": new_course.course_code,
                "course_title": new_course.course_title,
                "credit_load": new_course.credit_load,
                "semester": new_course.semester
            }
        ), 201

    except Exception as e:
        session.rollback()
        return jsonify(
            {
                'error': 'An error occurred while creating the course',
                'message': str(e)
            }
        ), 500


@app_views.route('/lecturer/courses', methods=['GET'])
@swag_from('./documentation/courses/get_course.yml')
@jwt_required()
def get_courses():
    """
    Retrieve all courses created by the authenticated lecturer.
    """
    # Retrieve lecturer's ID from the JWT token
    lecturer_id = get_jwt_identity()

    # Check if the lecturer exists
    lecturer = session.get(Lecturer, lecturer_id)
    if not lecturer:
        return jsonify({'error': 'Lecturer not found'}), 404

    # Retrieve all courses associated with the lecturer
    courses = lecturer.courses

    # Convert the list of Course objects to a list of dictionaries
    courses_list = [course.to_dict() for course in courses]

    return jsonify(courses_list), 200


@app_views.route('/courses/<string:course_id>', methods=['DELETE'])
@swag_from('./documentation/courses/delete_course.yml')
@jwt_required()
def delete_course(course_id):
    """
    Delete a specific course by its ID.
    """
    # Check if the course exists
    course = session.get(Course, course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    try:
        # Delete the course from the database
        course_name = course.course_title
        session.delete(course)
        session.commit()
        return jsonify(
            {
                'message': f'Course {course_name} deleted successfully',
                "id": course.id
            }
        ), 200

    except Exception as e:
        session.rollback()
        return jsonify(
            {
                'error': 'An error occurred while deleting the course',
                'message': str(e)
            }
        ), 500


@app_views.route('/courses/<string:course_id>', methods=['PUT'])
@swag_from('./documentation/courses/update_course.yml')
@jwt_required()
def update_course(course_id):
    """
    Update details of a specific course by its ID.
    """
    data = request.get_json()

    # Validate request data
    if not data:
        return jsonify({'error': 'Request body is empty'}), 400

    # Check if the course exists
    course = session.get(Course, course_id)
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
        session.commit()
        return jsonify(
            {
                "id": course.id,
                "course_name": course.course_title,
                "course_code": course.course_code,
                "credit_load": course.credit_load,
                "semester": course.semester
            }
        ), 200

    except Exception as e:
        session.rollback()
        return jsonify(
            {
                'error': 'An error occurred while updating the course',
                'message': str(e)
            }
        ), 500
