from app import create_app

# Initialize Flask app
app = create_app()

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
