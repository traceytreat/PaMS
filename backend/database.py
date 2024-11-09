from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from flask_cors import CORS
from datetime import date

db_path = "sqlite:///pams.db"

engine = create_engine(db_path, echo=True)

base = declarative_base()

class user(base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    techid = Column(Integer)
    role = Column(String)

class members(base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True)
    techid = Column(Integer)
    firstname = Column(String)
    lastname = Column(String)
    address = Column(String)
    householdminors = Column(Integer)
    householdadults = Column(Integer)
    householdseniors = Column(Integer)
    intakedate = Column(DateTime)



class inventory(base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True)
    sku = Column(String)
    name = Column(String)
    expiration = Column(DateTime)
    quantity = Column(Integer)


class visits(base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    memberid = Column(Integer, ForeignKey("members.id"))
    poundstaken = Column(Integer)
    visitdate = Column(DateTime)

    
class discardedItems(base):
    __tablename__ = "discardedItems"
    id = Column(Integer, primary_key=True)
    sku = Column(String)
    quantity = Column(Integer)
    reason = Column(String)
    userid = Column(Integer, ForeignKey("users.id"))
    discarddate = Column(DateTime)

class reports(base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True)
    reportdate = Column(DateTime)
    numbervisits = Column(Integer)
    newintakes = Column(Integer)
    householdserved = Column(Integer)
    householdminors = Column(Integer)
    householdadults = Column(Integer)
    householdseniors = Column(Integer)    
    totalpounds = Column(Integer)
    discarded = Column(Integer)

base.metadata.create_all(engine)
session_local = sessionmaker(bind=engine)
session_local = session_local()

def get_db_session():
    return session_local