from app import create_app


# Run the app
if __name__ == "__main__":
    # Initialize Flask app
    app = create_app()
    app.run(debug=True)
