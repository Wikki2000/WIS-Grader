#!/usr/bin/env python3
"""
This module defines routes for managing course enrollment.
"""
from flask import jsonify, request, abort
from api.v1.views import app_views
from models.student import Student
from models.course import Course
from models.storage import Storage
from models import storage
from flasgger.utils import swag_from

storage = Storage()
session = storage.get_session()

@app_views.route(
    '/course/students/<string:student_id>/enroll', methods=['POST']
)
@swag_from('./documentation/courses/enroll_student.yml')
def enroll_student(student_id):
    """Enroll a student in a specific course."""
    # Retrieve the course and student from the database
    course_code = request.get_json().get("course_code")

    if not course_code:
        return jsonify({"error": "Missing course_code Field"}), 400

    student = storage.get_by_id(Student, student_id)
    course = storage.get_by_field(Course, "course_code", course_code)

    print(student.first_name, course.course_title)

    # If the course or student doesn't exist, return a 404 error
    if not course or not student:
        abort(404)

    # Check if the student is already enrolled in the course
    if student in course.students:
        return jsonify({"error": "Student is already enrolled in the course"}), 400

    # Enroll the student in the course
    course.students.append(student)
    storage.save()

    return jsonify({
        "status": "Success",
        "message": "Student successfully enrolled in the course",
    }), 200


@app_views.route('/courses/<string:course_id>/students/<string:student_id>/enroll', methods=['DELETE'], strict_slashes=False)
@swag_from('./documentation/courses/remove_student.yml')
def remove_student(course_id, student_id):
    """Remove a student from a specific course."""
    # Retrieve the course and student from the database
    course = session.get(Course, course_id)
    student = session.get(Student, student_id)

    # If the course or student doesn't exist, return a 404 error
    if not course:
        return jsonify({"error": "Course not found"}), 404
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Check if the student is enrolled in the course
    if student not in course.students:
        return jsonify({"error": "Student is not enrolled in the course"}), 400

    # Remove the student from the course
    course.students.remove(student)
    storage.save()

    return jsonify({
        "message": "Student successfully removed from the course",
        "course_id": course_id,
        "student_id": student_id
    }), 200
