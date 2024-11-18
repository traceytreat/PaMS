# From https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import user, members, inventory, discardedItems, get_db_session
from reportgenerator import *

# Initializing flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route("/api/<path:path>", methods=["OPTIONS"])
def handle_options(path):
    return "", 204

@app.route("/api/report/totaltaken", methods=["GET"])
def memberTaken():
    memberid = request.args.get("member_id", type=int)
    if memberid is None:
        return jsonify({"Error": "Member not found"}), 404
    total = showPoundsTaken(memberid)
    return jsonify(total)


@app.route("/api/report/totalpoundstaken", methods=["GET"])
def totalpoundstaken():
    return jsonify(showTotalPoundsTaken())


@app.route("/api/report", methods=["GET"])
def get_reports():
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    intakes = showNewIntakes(month, year)
    poundsTotal = showTotalPoundsTaken(month, year)
    visitsTotal = showVisitCount(month, year)
    householdTotal = showHouseholdTotal(month, year)
    payload =         {
            "newIntakes": intakes,
            "totalPoundTaken": poundsTotal,
            "totalVisits": visitsTotal,
            "householdTotal": householdTotal,
        }

    return jsonify(payload)


@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    with get_db_session() as session:
        inventories = session.query(inventory).all()
        inventory_list = [
            {
                "id": item.id,
                "sku": item.sku,
                "name": item.name,
                "quantity": item.quantity,
            }
            for item in inventories
        ]

    return jsonify(inventory_list)


@app.route("/api/users", methods=["GET"])
def get_users():
    session = get_db_session()
    users = session.query(user).all()
    user_list = [
        {"id": user.id, "techid": user.techid, "username": user.username, "role": user.role} for user in users
    ]
    session.close()
    return jsonify(user_list)


@app.route("/api/members", methods=["GET"])
def get_members():
    session = get_db_session()
    member = session.query(members).all()
    member_list = [
        {
            "id": member.id,
            "firstname": member.firstname,
            "lastname": member.lastname,
            "techid": member.techid,
            "address": member.address,
            "minors": member.householdminors,
            "adults": member.householdadults,
            "seniors": member.householdseniors,
            "intakedate": member.intakedate,
        }
        for member in member
    ]
    session.close()
    return jsonify(member_list)

@app.route("/api/member", methods=["GET"])
def get_member_by_id():
    session = get_db_session()
    memberid = request.args.get("memberid", type=int)
    memberData = session.query(members).get(memberid)
    member = {
        "firstname": memberData.firstname,
        "lastname": memberData.lastname,
        "techid": memberData.techid,
        "address": memberData.address,
        "minors": memberData.householdminors,
        "adults": memberData.householdadults,
        "seniors": memberData.householdseniors
    }
    session.close()
    return jsonify(member)


@app.route('/api/discardedItems', methods=['GET'])
def get_discarded_items():
    session = get_db_session()
    items = session.query(discardedItems).all()
    discardedItems_list = [
        {
            "sku": item.sku,
            "quantity": item.quantity,
            "reason": item.reason,
            "discarddate": item.discarddate,
        }
        for item in items
    ]
    session.close()
    return jsonify(discardedItems_list)


@app.route("/api/inventory", methods=["POST"])
def add_inventory():
    inventory_data = request.json
    sku = inventory_data["sku"]
    name = inventory_data["name"]

    with get_db_session() as session:

        # check if item already exists in database
        existing_item = session.query(inventory).filter_by(sku=sku, name=name).first()

        if existing_item:
            # add 1 to item quantity
            existing_item.quantity += 1
            session.commit()
            return (
                jsonify(
                    {
                        "message": "Item quantity updated",
                        "sku": sku,
                        "name": name,
                        "id": existing_item.id,
                    }
                ),
                200,
            )
        else:
            # if item isn't already in database
            new_item = inventory(sku=sku, name=name, quantity=1)
            session.add(new_item)
            session.commit()
            return (
                jsonify(
                    {
                        "message": "Item added successfully!",
                        "sku": sku,
                        "name": name,
                        "id": new_item.id,
                    }
                ),
                201,
            )


@app.route("/api/inventory/<int:item_id>", methods=["DELETE"])
def delete_inventory(item_id):
    with get_db_session() as session:
        item = session.query(inventory).get(item_id)
        if item:
            if item.quantity > 1:
                item.quantity -= 1
                session.commit()
                return jsonify({"message": "Item quantity decreased by 1"}), 200
            else:
                session.delete(item)
                session.commit()
                return jsonify({"message": "Item deleted successfully!"}), 200
        else:
            return jsonify({"error": "Item not found"}), 404


@app.route("/api/discardedItems", methods=["POST"])
def add_discardedItems():
    itemdata = request.json
    session = get_db_session()
    new_discarded = discardedItems(
        sku=itemdata["sku"], quantity=itemdata["quantity"], reason=itemdata["reason"]
    )
    session.add(new_discarded)
    session.commit()
    session.close()
    return jsonify({"message": "Added succesfully"}, 201)


@app.route("/api/users", methods=["POST"])
def add_user():
    user_data = request.json
    session = get_db_session()
    new_user = user(username=user_data["username"], password=user_data["password"] ,role=user_data["role"])
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify({"message": "User added successfully!"}), 201


@app.route("/api/members", methods=["POST"])
def add_members():
    member_data = request.json
    session = get_db_session()
    new_member = members(
        firstname=member_data["firstname"],
        lastname=member_data["lastname"],
        techid=member_data["techid"],
        address=member_data["address"],
        householdminors=member_data["minors"],
        householdadults=member_data["adults"],
        householdseniors=member_data["seniors"],
    )
    session.add(new_member)
    session.commit()
    session.close()
    return jsonify({'message': 'member added successfully!'}), 201
    
@app.route('/api/members/<int:memberid>', methods=['PUT'])
def update_member(memberid):
    user_data = request.json
    print(memberid)
    session = get_db_session()
    member = session.query(members).filter(members.id == memberid).first()

    if not member:
        session.close()
        return jsonify({"message": "Member not found"}), 404

    member.techid = user_data.get("techid", members.techid)
    member.firstname = user_data.get("firstname", members.firstname)
    member.lastname = user_data.get("lastname", members.lastname)
    member.address = user_data.get("address", members.address)
    member.householdminors = user_data.get("minors", members.householdminors)
    member.householdadults = user_data.get("adults", members.householdadults)
    member.householdseniors = user_data.get("seniors", members.householdseniors)
    session.commit()
    session.close()
    return jsonify({"message": "User updated successfully"}), 200


@app.route("/api/members/<int:memberid>", methods=["DELETE"])
def delete_member(memberid):
    session = get_db_session()
    member = session.query(members).filter(members.id == memberid).first()

    if not member:
        session.close()
        return jsonify({"message": "Member not found"}), 404

    session.delete(member)
    session.commit()
    session.close()
    return jsonify({"message": "User deleted successfully"}), 200


@app.route("/api/users/<int:userid>", methods=["DELETE"])
def delete_user(userid):
    session = get_db_session()
    user = session.query(user).filter(user.id == userid).first()

    if not user:
        session.close()
        return jsonify({"message": "user not found"}), 404

    session.delete(user)
    session.commit()
    session.close()
    return jsonify({"message": "User deleted successfully"}), 200


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
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
