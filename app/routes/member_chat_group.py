#!/usr/bin/python3
""" Model for handling views for chat, friends & group UI """
from app.routes import app_views
from flask import abort, render_template
from api.v1.views.utils import role_required


@app_views.route(f"/groups/friends")
@role_required(["staff", "manager", "admin"])
def get_groups_friends(user_role: str, user_id: str):
    """Render templates for chat, friends & groups"""
    return render_template("members_chats/members_groups.html")


@app_views.route(f"/chat")
@role_required(["staff", "manager", "admin"])
def chat(user_role: str, user_id: str):
    """Render template for chat."""
    return render_template("members_chats/chat.html")
