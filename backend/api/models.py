from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from .managers import CustomUserManager


class Business(models.Model):
    name = models.CharField(
        max_length=50, verbose_name=_("business name"), unique=True)
    category = models.CharField(
        max_length=50, blank=True, verbose_name=_("business category"))
    country = models.CharField(
        max_length=50, blank=True, verbose_name=_("country"))

    def __str__(self):
        return self.name


class Category(models.Model):
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(
        max_length=50, verbose_name=_("category name"),
        unique=True
    )
    code = models.CharField(
        max_length=50, verbose_name=_("category code"),
        unique=True
    )

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    mobile_number = models.CharField(
        max_length=50, blank=True, null=True, verbose_name=_("mobile number"))
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name', 'password', 'mobile_number']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Check if the user is a superuser
        if self.is_superuser:
            self.business = None  # Set business to None for superusers
        super().save(*args, **kwargs)


class Item(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, default=None)
    name = models.CharField(
        max_length=50, verbose_name=_("item name"), unique=True)
    code = models.CharField(
        max_length=50, unique=True, verbose_name=_("item code"))
    unit_of_measure = models.CharField(
        max_length=50, verbose_name=_("unit of measure"))
    price = models.DecimalField(
        max_digits=50, decimal_places=2, verbose_name=_("price"))

    def __str__(self):
        return self.name


class Customer(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    name = models.CharField(
        max_length=50, verbose_name=_("customer name"), unique=True)
    code = models.CharField(
        max_length=50, unique=True, verbose_name=_("customer Code"))

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = (
        ('hold', "Hold"),
        ('paid', "Paid"),
        ('charged', "Charged"),
        ('void', "Void"),
    )

    PAYMENT_METHOD_CHOICES = (
        ('gcash', 'GCash'),
        ('cash', 'Cash'),
        ('debit_credit_card', 'Debit/Credit Card'),
    )

    def create_new_ref_number():
        existing_orders_count = Order.objects.count()

        if existing_orders_count == 0:
            reference_number = "0000000001"
        else:
            reference_number = str(existing_orders_count + 1).zfill(10)

        return reference_number
    
    def get_default_date():
        return timezone.now().date()

    reference_number = models.CharField(
        max_length=50,
        verbose_name="Reference Number",
        unique=True,
        default=create_new_ref_number
    )

    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        verbose_name="Business"
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        verbose_name="Customer",
        null=True,
        blank=True
    )

    amount = models.DecimalField(
        max_digits=11,
        decimal_places=2,
        verbose_name="Amount"
    )

    date = models.DateField(
        verbose_name="Order Date",
        default=get_default_date

    )

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='HLD',
        verbose_name="Status"
    )

    discount = models.DecimalField(
        max_digits=50,
        decimal_places=2,
        default=0,  # Default to 0 when no value is entered
        null=True,  # Allow the field to be nullable
        verbose_name="Discount"
    )

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        verbose_name="Payment Method",
        null=True
    )

    def get_status_display(self):
        return dict(self.STATUS_CHOICES).get(self.status, "Unknown")

    def __str__(self):
        return self.reference_number


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE)

    item = models.ForeignKey(
        Item, on_delete=models.CASCADE,
    )

    quantity = models.PositiveIntegerField(
        verbose_name="Quantity"
    )

    def __str__(self):
        return f"{self.quantity} x {self.item.name} in Order {self.order.reference_number}"

