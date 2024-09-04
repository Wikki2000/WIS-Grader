#!/usr/bin/pythn3
"""Handle API Request for Student Class."""
from models import storage
from models.result import Result
from models.course import Course
from models.student import Student
from flask import abort, jsonify, request
from flasgger.utils import swag_from
from api.v1.views import app_views


@app_views.route("/courses/<course_id>/students/<student_id>/results",
                 methods=["POST"], strict_slashes=False)
#@swag_from("documentation/student/post_school.yml")
def post_result(student_id, course_id):
    """Create a school object of a particular lecturer."""
    body = request.get_json()

    response = handle_error_400(body)
    if response:
        return jsonify(response), 400

    print("Endpont Access")

    student = storage.get_by_id(Student, student_id)
    course = storage.get_by_id(Course, course_id)
    if not student or course:
        abort(404)

    # Add student_id and course_id from url to request body
    body["student_id"] = student_id
    body["student_id"] = student_id

    result = Result(**body)
    storage.new(result)
    storage.save()

    response = get_json_success_response(student)
    return jsonify(response), 201


# ----------------------------HelperFunctionDefinition----------------- #

def handle_error_400(body):
    """Helper function to handle Bad Request Error (400)"""
    if not body:
        return {"error": "Empty Request Body"}
    elif not body.get("school_name"):
        return {"error": "school_name Field Missing"}


def get_json_success_response(obj):
    """Return json response on success for put $ post requests

    Args:
        obj (object): An instance of the class
    """
    response = {
            "id": obj.id,
            "test_score": obj.test_score,
            "exam_score": obj.exam_score,
            "total_score": obj.total_score,
            "grade": obj.grade,
            "remark": obj.remark
    }
    return response
