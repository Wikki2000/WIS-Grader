#!/usr/bin/python3
""" Handle course API CRUD operations. """
from . import api_views
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger.utils import swag_from
from flask import request, jsonify, abort
from api.v1.views.utils import bad_request
from models import storage
from models.course import Course
from datetime import date
from sqlalchemy.exc import IntegrityError


@api_views.route('/courses', methods=['POST'])
@jwt_required()
@swag_from('./documentation/courses/create_course.yml')
def create_course():
    """
    Create a new course under the lecturer's profile
    retrieved from the JWT token.
    """
    # Retrieve lecturer's ID from the token
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate request data
    required_fields = ["name", "code", "load", "semester", "level"]

    error_400 = bad_request(data, required_fields)
    if error_400:
        return jsonify(error_400), 400

    data["user_id"] = user_id  # Inject user ID to data.

    # Ensure that no same course is created for same year.
    data["code"] = data.get("code") + "_" + str(date.today().year)

    try:
        # Add the new course to the database
        new_course = Course(**data)
        storage.new(new_course)
        storage.save()
        new_course = storage.get_by(Course, id=new_course.id)
        return jsonify(new_course.to_dict()), 200
    except IntegrityError as e:
        print(str(e))
        code_year = new_course.code.split('_')
        code = code_year[0]
        year = code_year[1]
        storage.rollback()
        return jsonify({
            "error": f"{code} for {year} Session Exist's Already"
        }), 409
    except Exception as e:
        # Catch the exception and return the error message as JSON
        print(str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        storage.close()


@api_views.route('/courses', methods=['GET'])
@jwt_required()
@swag_from('./documentation/courses/get_courses.yml')
def get_courses():
    """
    Retrieve all courses created by the authenticated lecturer.
    """
    # Retrieve lecturer's ID from the JWT token
    user_id = get_jwt_identity()

    # Retrieve all courses associated with the user
    courses = storage.all_get_by(Course, user_id=user_id)
    if not courses:
        return jsonify([]), 200
    sorted_courses = sorted(courses, key=lambda course : course.updated_at)

    # Convert the list of Course objects to a list of dictionaries
    courses_list = [{
        'course': course.to_dict(),
        'student_count': len(course.students)  # Add student count
    } for course in sorted_courses]

    storage.close()
    return jsonify(courses_list[:5]), 200


@api_views.route('/courses/<string:course_id>', methods=['DELETE'])
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
        storage.delete(course)
        storage.save()
        return jsonify(
            {
                "status": "Success",
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


@api_views.route('/courses/<string:course_id>/edit', methods=['PUT'])
@jwt_required()
@swag_from('./documentation/courses/update_course.yml')
def update_course(course_id):
    """
    Update details of a specific course by its ID.
    """
    data = request.get_json()
    course = storage.get_by(Course, id=course_id)
    if not course:
        abort(404)

    # Ensure that no same course is created for same year.
    data["code"] = data.get("code") + "_" + str(date.today().year)

    for key, val in data.items():
        setattr(course, key, val)
    storage.save()
    course = storage.get_by(Course, id=course_id)
    return jsonify(course.to_dict()), 200


@api_views.route('/courses/<string:course_id>/get', methods=['GET'])
@jwt_required()
@swag_from('./documentation/courses/get_course.yml')
def get_course_id(course_id):
    """ Retrieve a course by its ID. """

    user_id = get_jwt_identity()
    course = storage.get_by(Course, id=course_id, user_id=user_id)
    if not course:
        abort(404)

    #course_dict['student_count'] = len(course_obj.students)
    return jsonify(course.to_dict()), 200


