# From https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import user, members, inventory, get_db_session
# Initializing flask app
app = Flask(__name__)
CORS(app)


@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    session = get_db_session()
    inventories = session.query(inventory).all()
    inventory_list = [{'sku': item.sku, 'name': item.name} for item in inventories]
    session.close()
    return jsonify(inventory_list)

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    inventory_data = request.json
    session = get_db_session()
    new_item = inventory(sku=inventory_data['sku'], name=inventory_data['name'])
    session.add(new_item)
    session.commit()
    session.close()
    return jsonify({'message': 'Item added successfully!'}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    session = get_db_session()
    users = session.query(user).all()
    user_list = [{'id': user.id, 'username': user.username, 'role': user.role} for user in users]
    session.close()
    return jsonify(user_list)

@app.route('/api/users', methods=['POST'])
def add_user():
    user_data = request.json
    session = get_db_session()
    new_user = members(username=user_data['username'], role=user_data['role'])
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify({'message': 'User added successfully!'}), 201

@app.route('/api/members', methods=['GET'])
def get_members():
    session = get_db_session()
    member = session.query(members).all()
    member_list = [{'firstname': member.firstname, 'lastname': member.lastname} for member in member]
    session.close()
    return jsonify(member_list)

@app.route('/api/members', methods=['POST'])
def add_members():
    member_data = request.json
    session = get_db_session()
    new_member = members(firstname=member_data['firstname'], lastname=member_data['lastname'])
    session.add(new_member)
    session.commit()
    session.close()
    return jsonify({'message': 'member added successfully!'}), 201

    
# Running app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)