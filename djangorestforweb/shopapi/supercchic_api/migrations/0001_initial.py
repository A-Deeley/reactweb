# Generated by Django 4.1.7 on 2023-03-08 22:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_mysql.models.fields.bit


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Companies',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Departments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Panier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('secondary_name', models.CharField(max_length=50)),
                ('qty', models.FloatField(blank=True, null=True)),
                ('cup', models.CharField(blank=True, max_length=12, null=True, unique=True)),
                ('price', models.FloatField(blank=True, null=True)),
                ('unit_type', models.CharField(max_length=50)),
                ('apply_tps', django_mysql.models.fields.bit.Bit1BooleanField()),
                ('apply_tvq', django_mysql.models.fields.bit.Bit1BooleanField()),
                ('discount_type', django_mysql.models.fields.bit.Bit1BooleanField()),
                ('discount_amt', models.FloatField(blank=True, null=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='supercchic_api.companies')),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='supercchic_api.departments')),
            ],
        ),
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='TransactionRows',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price_unit', models.FloatField(blank=True, null=True)),
                ('discount_amt_unit', models.FloatField(blank=True, null=True)),
                ('tps_unit', models.FloatField(blank=True, null=True)),
                ('tvq_unit', models.FloatField(blank=True, null=True)),
                ('qty_unit', models.FloatField(blank=True, null=True)),
                ('product', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='supercchic_api.products')),
                ('transaction', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='supercchic_api.transactions')),
            ],
        ),
        migrations.CreateModel(
            name='PanierRow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('panier', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='supercchic_api.panier')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='supercchic_api.products')),
            ],
        ),
    ]
