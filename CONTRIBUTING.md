# Coding Standards


## Variable Naming Conventions
- **Variable Names**: Use `snake_case` (e.g., `user_name`, `order_total`).
- **Class Names**: Use `PascalCase` (e.g., `UserProfile`, `OrderProcessor`).
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`, `DEFAULT_TIMEOUT`).
- **Private Variables**: Prefix with an underscore `_` (e.g., `_private_data`).
- **Descriptive Names**: Ensure names clearly describe the variable’s purpose.


## Function Naming
- **Function Names**: Use `snake_case` (e.g., `calculate_total_amount`, `fetch_user_data`).
- **Descriptive Names**: Ensure names clearly describe the function’s purpose (e.g., `get_user_by_id`).
- **Defining a new function**: Skip two lines.


## Class Structure
- **Class Definition**: Each class should be defined in a separate file.
- **Class Methods**: Use `snake_case` for method names and keep methods concise.
- **Constructor**: Name the constructor method `__init__` (e.g., `class User: def __init__(self, name): ...`).
- **Defining a new method**: Skip one line.


## File Naming Conventions
- **Source Code Files**: Use `snake_case` for file names (e.g., `user_service.py`, `order_controller.py`).
- **Configu**:ration Files Use `snake_case` (e.g., `app_config.yml`, `database_settings.json`).
- **Descriptive Names**: Ensure names clearly describe the file’s purpose (e.g., `registration.py`, `login.py`).
- **Consistent Naming**: Related files should have matching names to maintain clarity and organization. For example, if you have a file named `login.html`, the associated CSS file should be named `login.css`, the JavaScript file should be named `login.js`, and any images should follow a similar naming convention, such as `login.jpeg`.


## Code Formatting for Python
- **Indentation**: Use 4 spaces for indentation.
- **Line Length**: Limit lines to 79 characters.


## Code Formatting for JavaScript
- **Indentation**: Use 2 spaces for indentation.
- **Naming Convention for variables & functions**: Use camelCase.
- **Naming Convention for Constructor functions**: Use PascalCase.


## Code Formatting for CSS
- **Indentation**: Use two spaces.
- **Naming Convention**: Use BEM Convention.
- **Styling**: Avoid internal/inline styling.


## Code Formatting for HTML
- **Indentation**: Use four spaces.
- **Naming Convention for HTML Tags**: Use lower-case.


## Commenting
- **Inline Comments**: Use inline comments to clarify complex code but avoid over-commenting.
- **Docstrings**: Use docstrings for documenting functions, classes, and modules (e.g., Python's triple quotes).


## Error Handling
- **Exceptions**: Use specific exceptions rather than generic ones. Include error messages that provide context.
- **Validation**: Validate input and handle errors gracefully, providing meaningful feedback to users.


## Version Control
- **Commit Messages**: Use descriptive commit messages (e.g., `Fix bug in user authentication`, `Add new feature for order tracking`).
- **Branching**: Use feature branches for new development (e.g., `feature/user_authentication`, `bugfix/fix_login_issue`).


## Testing
- **Unit Tests**: Write unit tests for individual components and functions. Use a consistent naming convention (e.g., `test_function_name`).
- **Integration Tests**: Ensure components work together as expected. Test critical paths and interactions.
- **Code Coverage**: Aim for high code coverage but focus on meaningful tests that cover critical functionality.


## Documentation
- **Inline Documentation**: Document important logic within the code.
- **External Documentation**: Maintain up-to-date external documentation (e.g., README.md, API docs) for developers and users.
- **Endpoints**: Document each endpoint with Swagger (Powered by Flasgger) before implementation.


## Security Practices
- **Data Handling**: Avoid hardcoding sensitive data. Use environment variables for credentials and secrets.
- **Input Validation**: Always validate and sanitize user inputs to prevent security vulnerabilities like SQL injection and XSS.


## Dependencies
- **Versioning**: Specify exact versions of dependencies to ensure consistent environments.
- **Updates**: Regularly update dependencies to mitigate security risks and benefit from new features.
- All ependencies should be captured under requirements.txt
