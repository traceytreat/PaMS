from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import date

db_path = "sqlite:///pams.db"

engine = create_engine(db_path, echo=True)

base = declarative_base()

class user(base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    role = Column(String)

class customer(base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True)
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
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True)
    customerid = Column(Integer, ForeignKey("customers.id"))
    poundstaken = Column(Integer)
    visitdate = Column(DateTime)

    
class discard(base):
    __tablename__ = "discard"
    id = Column(Integer, primary_key=True)
    sku = Column(String)
    quantity = Column(Integer)
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