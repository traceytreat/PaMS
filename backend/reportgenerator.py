from flask import Flask, request, jsonify
from flask_cors import CORS
from database import user, members, inventory, discardedItems, visits, get_db_session
from datetime import datetime, date
from sqlalchemy import func, extract

app = Flask(__name__)


def showNewIntakes(month, year):
    with get_db_session() as session:
        results = (
            session.query(
                func.count(members.id).label("membercount"),
            )
            .filter(extract('year', members.intakedate) == year)
            .filter(extract('month', members.intakedate) == month)
            .first()
        )
        return results.membercount or 0
    


def showTotalPoundsTaken(month, year):
    with get_db_session() as session:
        results = (
            session.query(
                func.sum(visits.poundstaken).label("totaltaken"),
            )
            .filter(extract('year', visits.visitdate) == year)
            .filter(extract('month', visits.visitdate) == month)
            .first()
        )
        return results.totaltaken or 0



def showPoundsTaken(memberid):
    current_year = datetime.now().year
    current_month = datetime.now().month
    with get_db_session() as session:
        results = (
            session.query(func.sum(visits.poundstaken).label("totalTaken"))
            .filter(
                members.id == memberid,
                extract("year", visits.visitdate) == current_year,
                extract("month", visits.visitdate) == current_month,
            )
            .scalar()
        )
        return results or 0


def showVisitCount(month, year):
    with get_db_session() as session:
        results = (
            session.query(
                func.count(visits.id).label("visitcount"),
                func.count(func.distinct(visits.memberid)).label("uniquevisit"),
            )
            .filter(extract('year', visits.visitdate) == year)
            .filter(extract('month', visits.visitdate) == month)
            .first()
        )
        return {
            "total": results.visitcount,
            "uniqueVisit": results.uniquevisit
        }


def showHouseholdTotal(month, year):
    with get_db_session() as session:
        results = (
            session.query(
                func.sum(members.householdadults).filter(members.id == visits.memberid).label("adults"),
                func.sum(members.householdminors).filter(members.id == visits.memberid).label("minors"),
                func.sum(members.householdseniors).filter(members.id == visits.memberid).label("seniors")
            )
            .filter(extract('year', visits.visitdate) == year)
            .filter(extract('month', visits.visitdate) == month)
            .first()
        )
        householdTotal = results.adults + results.minors + results.seniors

        return {
            "adults": results.adults,
            "minors": results.minors,
            "seniors": results.seniors,
            "total": householdTotal
        }
