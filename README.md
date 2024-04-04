# IBook Setup Guide

IBook makes writing and organizing documents easy, with tools for editing, previewing, and sharing. And it supports teamwork by allowing collaboration on shared documents.

Double-Click on any word to find its definitions easily in a side panel.

## Getting Started

To use IBook, ensure you have [Node.js](https://nodejs.org/en/), npm, [Python](https://www.python.org/), and pip installed on your machine. Once these prerequisites are met, follow the steps below to set up the project:

### Clone the Project
First, obtain the source code by cloning the repository or unpacking the downloaded code:

```bash
git clone https://github.com/tayyab-1/IBook.git # Or unzip the downloaded code
cd IBook # Navigate into the project directory
```

### Set Up the Backend
Create a Python virtual environment, activate it, install the necessary dependencies, and start the Django server:
```bash
python3 -m venv env
source env/bin/activate # Use 'env\Scripts\activate' on Windows
cd serverApp
pip install -r requirements.txt
python manage.py runserver
```
This command launches the server at http://127.0.0.1:8000/, ready for API calls.

### Set Up the Frontend
Install the Angular CLI, then install project dependencies and launch the frontend server:
```bash
npm install -g @angular/cli@15 # Install Angular CLI
cd ../clientApp # Ensure you're in the IBook directory before changing to clientApp
npm install # Install dependencies
ng serve # Launch the server
```
Visit http://localhost:4200 in your browser to start using IBook.

### Troubleshooting
#### Resolving Port Conflicts
If you encounter an issue where the servers for either the backend or frontend cannot start due to the ports being already in use, you will need to change the default ports for either the Django server or the Angular application.

#### Changing the Django Server Port:
By default, Django runs on port 8000. To start the server on a different port, simply specify the port number when running runserver. For example, to use port 8001:
```bash
python manage.py runserver 8001
```
Remember to update any environment variables or configurations in the Angular application that reference the backend API URL to reflect the new port.

#### Changing the Angular Application Port:

Angular applications default to port 4200. To serve your application on a different port, use the --port option with ng serve. For example, to use port 4201:
```bash
ng serve --port 4201
```
After changing the port, you can access the Angular application by visiting http://localhost:4201 (or whichever port you chose) in your browser.

By adjusting the ports as described, you can resolve conflicts and ensure both your backend and frontend servers run smoothly.
