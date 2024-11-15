from flask import Flask, request, jsonify
from flask_cors import CORS
from database import user, members, inventory, discardedItems, visits, get_db_session
from datetime import datetime, date
from sqlalchemy import func, extract

app = Flask(__name__)


def showNewIntakes():
    with get_db_session() as session:
        results = (
            session.query(
                func.strftime("%Y-%m", members.intakedate).label("month"),
                func.count(members.id).label("membercount"),
            )
            .group_by("month")
            .order_by("month")
            .all()
        )
        memberCounts = {result.month: result.membercount for result in results}
        return memberCounts


def showTotalPoundsTaken():
    with get_db_session() as session:
        results = (
            session.query(
                func.strftime("%Y-%m", visits.visitdate).label("month"),
                func.sum(visits.poundstaken).label("totaltaken"),
            )
            .group_by("month")
            .order_by("month")
            .all()
        )
        totalTaken = {result.month: result.totaltaken for result in results}
        return totalTaken


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


def showVisitCount():
    with get_db_session() as session:
        results = (
            session.query(
                func.strftime("%Y-%m", visits.visitdate).label("month"),
                func.count(visits.id).label("visitcount"),
                func.count(func.distinct(visits.memberid)).label("uniquevisit"),
            )
            .group_by("month")
            .order_by("month")
            .all()
        )
        visitcount = [
            {
                "month": row.month,
                "visitcount": row.visitcount,
                "uniqueVisits": row.uniquevisit,
            }
            for row in results
        ]
        return visitcount


def showHouseholdTotal():
    with get_db_session() as session:
        results = (
            session.query(
                extract("year", visits.visitdate).label("year"),
                extract("month", visits.visitdate).label("month"),
                func.sum(members.householdadults).label("adults"),
                func.sum(members.householdminors).label("minors"),
                func.sum(members.householdseniors).label("seniors"),
                (
                    func.sum(members.householdadults)
                    + func.sum(members.householdminors)
                    + func.sum(members.householdseniors)
                ).label("householdTotal"),
            )
            .group_by(
                extract("year", visits.visitdate), extract("month", visits.visitdate)
            )
            .order_by(
                extract("year", visits.visitdate), extract("month", visits.visitdate)
            )
            .all()
        )

        householdTotal = [
            {
                "year": row.year,
                "month": row.month,
                "adults": row.adults,
                "minors": row.minors,
                "seniors": row.seniors,
                "householdTotal": row.householdTotal,
            }
            for row in results
        ]

        return householdTotal
