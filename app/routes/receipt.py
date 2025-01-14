#!/usr/bin/python3
""" Model for handling views for receipts. """
from app.routes import app_views
from flask import abort, render_template, jsonify
from api.v1.views.utils import role_required


@app_views.route("/orders/print-receipt")
@role_required(["staff", "manager", "admin"])
def print_order_receipt(user_role: str, user_id: str):
    """"Render templates for order receipts"""
    return render_template("receipts/order_receipt.html")


@app_views.route("/bookings/print-receipt")
@role_required(["staff", "manager", "admin"])
def print_booking_receipt(user_role: str, user_id: str):
    """"Render templates for booking receipts""" 
    return render_template("receipts/booking_receipt.html")
