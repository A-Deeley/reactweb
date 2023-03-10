# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django_mysql.models import Bit1BooleanField


class Companies(models.Model):
    name = models.CharField(unique=True, max_length=255)
    
    def __str__(self):
        return self.name


class Departments(models.Model):
    name = models.CharField(unique=True, max_length=255)

    def __str__(self):
        return self.name


class Products(models.Model):
    company = models.ForeignKey(Companies, models.DO_NOTHING, blank=True, null=True)
    image = models.ImageField(upload_to='product_img/')
    department = models.ForeignKey(Departments, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(unique=False, blank=False, max_length=50)
    secondary_name = models.CharField(unique=False, max_length=50)
    qty = models.FloatField(blank=True, null=True)
    cup = models.CharField(unique=True, max_length=12, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    unit_type = models.CharField(max_length=50)
    apply_tps = Bit1BooleanField()  # This field type is a guess.
    apply_tvq = Bit1BooleanField()  # This field type is a guess.
    discount_type = models.SmallIntegerField(blank=True, null=True)
    discount_amt = models.FloatField(blank=True, null=True)

    def image_url(self):
        return self.image.url

    def __str__(self):
        return self.name


class TransactionRows(models.Model):
    transaction = models.ForeignKey('Transactions', models.DO_NOTHING, blank=True, null=True)
    product = models.ForeignKey(Products, models.DO_NOTHING, blank=True, null=True)
    price_unit = models.FloatField(blank=True, null=True)
    discount_amt_unit = models.FloatField(blank=True, null=True)
    tps_unit = models.FloatField(blank=True, null=True)
    tvq_unit = models.FloatField(blank=True, null=True)
    qty_unit = models.FloatField(blank=True, null=True)


class Transactions(models.Model):
    date = models.DateTimeField()

    def __str__(self):
        return "Transaction du " + self.date


class Panier(models.Model):
    owner = models.ForeignKey(User, models.DO_NOTHING, blank=False, null=False)

    # def __init__(self, user):
    #     self.owner = user

    def __str__(self):
        return "Panier de " + self.owner.username


class PanierRow(models.Model):
    product = models.ForeignKey(Products, models.DO_NOTHING, blank=False, null=False)
    panier = models.ForeignKey(Panier, models.DO_NOTHING, related_name='rows')
    quantity = models.FloatField(blank=False, null=False)

    def __str__(self):
        return str(self.quantity) + "x " + self.product.name

