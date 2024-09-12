#!/usr/bin/python3
"""Define function needed accross different files."""
import requests
from flask import jsonify, request


def get_auth_headers():
    """
    Helper function to retrieve access token from cookie and set header
    """
    token = request.cookies.get('access_token_cookie')
    if not token:
        return None
    return {'Authorization': f'Bearer {token}'}


def safe_api_request(url, method='GET', params=None, headers=None, timeout=10):
    """
    Makes a safe API request and returns the JSON response and status code.

    Args:
        url (string) - The URL of the API endpoint.
        method (string) - The HTTP method ('GET', 'POST', 'PUT', 'DELETE', etc.).
        params (dict) - Query  or body parameters for HTTPS requests.
        headers (string) - Headers to include in the request. Default is None.
        timeout (string) - Timeout duration, Default is 10 seconds.

    return:
       success (tupple) - A tuple containing (response JSON, status code)
       failure (tupple) - If an exception occurs it returns (None, error message)..
    """
    try:
        method = method.upper()

        if method == 'GET':
            response = requests.get(
                url, headers=headers, params=params, timeout=timeout
            )
        elif method == 'POST':
            response = requests.post(
                url, headers=headers, json=params, timeout=timeout
            )
        elif method == 'PUT':
            response = requests.put(
                url, headers=headers, json=params, timeout=timeout
            )
        elif method == 'DELETE':
            response = requests.delete(
                url, headers=headers, json=params, timeout=timeout
            )
        else:
            return jsonify({"error": f"Unsupported HTTP method: {method}"}), 415

        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out."}), 408
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Failed to connect to the server."}), 503
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request error occurred: {str(e)}"}), 500
    except ValueError:
        return jsonify({"error": "Error decoding JSON response."}), 415
