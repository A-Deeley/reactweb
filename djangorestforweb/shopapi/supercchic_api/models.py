# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django_mysql.models import Bit1BooleanField


class Companies(models.Model):
    name = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'companies'


class Departments(models.Model):
    name = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'departments'


class Products(models.Model):
    company = models.ForeignKey(Companies, models.DO_NOTHING, blank=True, null=True)
    department = models.ForeignKey(Departments, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(unique=True, max_length=50)
    qty = models.FloatField(blank=True, null=True)
    cup = models.CharField(unique=True, max_length=12, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    unit_type = models.CharField(max_length=50)
    apply_tps = Bit1BooleanField()  # This field type is a guess.
    apply_tvq = Bit1BooleanField()  # This field type is a guess.
    discount_type = Bit1BooleanField()  # This field type is a guess.
    discount_amt = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'products'


class TransactionRows(models.Model):
    transaction = models.ForeignKey('Transactions', models.DO_NOTHING, blank=True, null=True)
    product = models.ForeignKey(Products, models.DO_NOTHING, blank=True, null=True)
    price_unit = models.FloatField(blank=True, null=True)
    discount_amt_unit = models.FloatField(blank=True, null=True)
    tps_unit = models.FloatField(blank=True, null=True)
    tvq_unit = models.FloatField(blank=True, null=True)
    qty_unit = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transaction_rows'


class Transactions(models.Model):
    date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'transactions'

