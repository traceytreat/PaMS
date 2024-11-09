# From https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import user, members, inventory, discardedItems, reports, get_db_session
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

@app.route('/api/users', methods=['GET'])
def get_users():
    session = get_db_session()
    users = session.query(user).all()
    user_list = [{'id': user.id, 'username': user.username, 'role': user.role} for user in users]
    session.close()
    return jsonify(user_list)

@app.route('/api/members', methods=['GET'])
def get_members():
    session = get_db_session()
    member = session.query(members).all()
    member_list = [{'firstname': member.firstname, 'lastname': member.lastname} for member in member]
    session.close()
    return jsonify(member_list)

@app.route('/api/discardedItems', methods=['GET'])
def get_members():
    session = get_db_session()
    items = session.query(discardedItems).all()
    discardedItems_list = [{'sku': item.sku, 'quantity': item.quantity, 'reason': item.reaons, 'discarddate': item.discarddate} for item in items]
    session.close()
    return jsonify(discardedItems_list)

@app.route('/api/reports', methods=['GET'])
def get_members():
    session = get_db_session()
    reports = session.query(reports).all()
    report_list = [{'numbersisits': report.numbervisits, 'newintakes': report.newintakes, 'HousesServed': report.householdserved, 'totalpounds': report.totalpounds,'discarded': report.discarded} for report in reports]
    session.close()
    return jsonify(report_list)

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    inventory_data = request.json
    session = get_db_session()
    new_item = inventory(sku=inventory_data['sku'], name=inventory_data['name'])
    session.add(new_item)
    session.commit()
    session.close()
    return jsonify({'message': 'Item added successfully!'}), 201

@app.route('/api/users', methods=['POST'])
def add_user():
    user_data = request.json
    session = get_db_session()
    new_user = members(username=user_data['username'], role=user_data['role'])
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify({'message': 'User added successfully!'}), 201

@app.route('/api/members', methods=['POST'])
def add_members():
    member_data = request.json
    session = get_db_session()
    new_member = members(firstname=member_data['firstname'], lastname=member_data['lastname'])
    session.add(new_member)
    session.commit()
    session.close()
    return jsonify({'message': 'member added successfully!'}), 201
    
=======
@app.route('/api/members/<int:memberid>', methods=['PUT'])
def update_member(memberid):
    user_data = request.json
    session = get_db_session()
    member = session.query(members).filter(members.id == memberid).first()

    if not member:
        session.close()
        return jsonify({'message': 'Member not found'}), 404

    member.techid = user_data.get('techid', members.techid)
    member.firstname = user_data.get('first name', members.firstname)
    member.lastname = user_data.get('last name', members.lastname)
    member.address = user_data.get('address', members.addres)
    member.householdminors = user_data.get('minors', members.householdminors)
    member.householdadults = user_data.get('adults', members.householdadults)
    member.householdseniors = user_data.get('seniors', members.householdseniors)
    session.commit()
    session.close()
    return jsonify({'message': 'User updated successfully'}), 200

@app.route('/api/members/<int:memberid>', methods=['DELETE'])
def delete_member(memberid):
    session = get_db_session()
    member = session.query(members).filter(members.id == memberid).first()

    if not member:
        session.close()
        return jsonify({'message': 'Member not found'}), 404

    session.delete(member)
    session.commit()
    session.close()
    return jsonify({'message': 'User deleted successfully'}), 200 

@app.route('/api/users/<int:userid>', methods=['DELETE'])
def delete_user(userid):
    session = get_db_session()
    user = session.query(user).filter(user.id == userid).first()

    if not user:
        session.close()
        return jsonify({'message': 'user not found'}), 404

    session.delete(user)
    session.commit()
    session.close()
    return jsonify({'message': 'User deleted successfully'}), 200 

@app.route('/api/login', methods=['POST'])
def login():
    login_data = request.json
    session = get_db_session()
    username = login_data.get('username')
    password = login_data.get('password')

    user_instance = session.query(user).filter_by(username=username).first()

    if user_instance and user_instance.password == password:
        session.close()
        return jsonify({'username': user_instance.username, 'role': user_instance.role, 'techid': user_instance.techid, 'message': 'Login successful'}), 200
    else:
        session.close()
        return jsonify({'message': 'Invalid username or password'}), 401
      
# Running app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)