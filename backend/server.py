# From https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import user, members, inventory, get_db_session
# Initializing flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return '', 204

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    with get_db_session() as session:
        inventories = session.query(inventory).all()
        inventory_list = [{'id': item.id, 'sku': item.sku, 'name': item.name, 'quantity': item.quantity} for item in inventories]

    return jsonify(inventory_list)

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    inventory_data = request.json
    sku = inventory_data['sku']
    name = inventory_data['name']

    with get_db_session() as session:

        # check if item already exists in database
        existing_item = session.query(inventory).filter_by(sku=sku, name=name).first()

        if existing_item:
            # add 1 to item quantity
            existing_item.quantity += 1
            session.commit()
            return jsonify({'message': 'Item quantity updated', 'sku': sku, 'name': name, 'id': existing_item.id}), 200
        else:
            # if item isn't already in database
            new_item = inventory(sku=sku, name=name, quantity=1)
            session.add(new_item)
            session.commit()
            return jsonify({'message': 'Item added successfully!', 'sku': sku, 'name': name, 'id': new_item.id}), 201

    

@app.route('/api/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory(item_id):
    with get_db_session() as session:
        item = session.query(inventory).get(item_id)
        if item:
            if item.quantity > 1:
                item.quantity -= 1
                session.commit()
                return jsonify({'message': 'Item quantity decreased by 1'}), 200
            else:
                session.delete(item)
                session.commit()
                return jsonify({'message': 'Item deleted successfully!'}), 200
        else:
            return jsonify({'error': 'Item not found'}), 404

@app.route('/api/inventory/<int:item_id>', methods=['PATCH'])
def update_inventory(item_id):
    with get_db_session() as session:
        item = session.query(inventory).get(item_id)
        if item:
            quantity_change = request.json.get('quantity', 0)
            if quantity_change != 0:
                item.quantity += quantity_change
                session.commit()
                return jsonify({'message': f'Updated qty by {quantity_change}'}), 200
            else:
                return jsonify({'error': 'Error with qty update'}), 400
        else:
            return jsonify({'error': 'Item not found'}), 404

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