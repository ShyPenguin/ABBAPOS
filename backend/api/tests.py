from django.test import TestCase
from rest_framework.test import APITestCase
from .models import CustomUser, Item, Customer
from .serializers.Customer import CustomerSerializer
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from .serializers.Item import ItemSerializer
from decimal import Decimal
from django.contrib.auth import get_user_model
# Create your tests here.

# Test is out of date and the developers resorted to testing the API through Postman
# class CustomAuthTokenTest(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user = CustomUser.objects.create_user(
#             email='jaw@gmail.com', password='Jawad3102')
#         self.token = Token.objects.create(user=self.user)

#     def test_custom_auth_token_valid(self):
#         response = self.client.post(
#             '/api/auth/login', {'email': 'jaw@gmail.com', 'password': 'Jawad3102'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertIn('token', response.data)

#     def test_custom_auth_token_fail(self):
#         response = self.client.post(
#             '/api/auth/login', {'email': 'jaw45@gmail.com', 'password': '3213'})

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(response.data['message'], 'Invalid email/password')

#     def test_logout_view(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.delete('/api/auth/logout')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_logout_view_unauthorized(self):
#         response = self.client.delete('/api/auth/logout')
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# class RecordViewTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user_data = {
#             "first_name": "John",
#             "last_name": "Doe",
#             "email": "johndoe@example.com",
#             "mobile_number": "1234567890",
#             "password": "securepassword",
#             "business_name": "Yahshua",
#             "business_category": "Automotive",
#             "country": "Philippines"
#         }
#         self.url = "/api/signup/"  # Adjust the URL name if needed

#     def test_create_user_and_token(self):
#         response = self.client.post("/api/signup/", self.user_data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         # Verify that a user and token were created
#         self.assertTrue(CustomUser.objects.filter(
#             email=self.user_data["email"]).exists())
#         user = CustomUser.objects.get(email=self.user_data["email"])
#         self.assertTrue(Token.objects.filter(user=user).exists())

#         # Verify the response data
#         expected_data = {
#             "token": Token.objects.get(user=user).key,
#             "user_id": user.pk,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "email": user.email,
#             "mobile_number": user.mobile_number,
#             "business_name": user.business_name,
#             "business_category": user.business_category,
#             "country": user.country,

#         }

#         self.assertEqual(response.data, expected_data)

#     def test_invalid_user_data(self):
#         # Omit required fields to make the data invalid
#         invalid_user_data = {
#             "first_name": "John",
#             "last_name": "Doe",
#             "password": "securepassword",
#         }
#         response = self.client.post(self.url, invalid_user_data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class ItemViewSetTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.url = '/api/items/'  # Update the URL as needed
#         self.user = CustomUser.objects.create_user(
#             email='jaw@gmail.com', password='Jawad3102')
#         self.token = Token.objects.create(user=self.user)
#         self.item_data = {
#             'user': self.user,
#             'name': 'Sample Item',
#             'code': 'ITEM001',
#             'unit_of_measure': 'Each',
#             'price': "10.99",
#         }
#         self.item = Item.objects.create(**self.item_data)

#     def test_list_items(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["count"], 1)
#         self.assertEqual(response.data["next"], None)
#         self.assertEqual(response.data["previous"], None)

#         # Convert the response data (OrderedDict) to a dictionary
#         response_data_dict = dict(response.data["results"][0])
#         for key, value in response_data_dict.items():
#             self.assertEqual(getattr(self.item, key), value)

#     def test_create_item(self):
#         self.item_data = {
#             'name': 'bANANA',
#             'code': '900',
#             'unit_of_measure': 'lITTER',
#             'price': "10.99",
#         }

#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.post(self.url, self.item_data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         # Check that a new item was created
#         self.assertEqual(Item.objects.count(), 2)

#     def test_create_item_unauthorized(self):
#         self.item_data = {
#             'name': 'bANANA',
#             'code': '900',
#             'unit_of_measure': 'lITTER',
#             'price': "10.99",
#         }
#         response = self.client.post(self.url, self.item_data)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_create_item_bad_request(self):
#         self.item_data = {
#             'name': 'bANANA',
#             'code': 'ITEM001',
#             'unit_of_measure': 'lITTER',
#             'price': "10.99",
#         }
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.post(self.url, self.item_data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_retrieve_item(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.get(f'{self.url}{self.item.id}/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         serializer = ItemSerializer(self.item)
#         self.assertEqual(response.data, serializer.data)

#     def test_retrieve_item_not_found(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.get(f'{self.url}300/')
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

#     def test_update_item(self):
#         updated_data = {
#             'name': 'Updated Item',
#             'code': 'ITEM002',
#             'unit_of_measure': 'Pack',
#             'price': Decimal('15.99'),
#         }
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.put(
#             f'{self.url}{self.item.id}/', updated_data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.item.refresh_from_db()
#         for key, value in updated_data.items():
#             self.assertEqual(getattr(self.item, key), value)

#     def test_update_item_bad_request(self):
#         updated_data = {
#             'name': 'Updated Item',
#             'code': 'ITEM001',
#             'price': Decimal('15.99'),
#         }
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.put(
#             f'{self.url}{self.item.id}/', updated_data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_update_item_unauthorized(self):
#         updated_data = {
#             'name': 'Updated Item',
#             'code': 'ITEM002',
#             'unit_of_measure': 'Pack',
#             'price': Decimal('15.99'),
#         }
#         response = self.client.put(
#             f'{self.url}{self.item.id}/', updated_data)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_delete_item(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.delete(f'{self.url}{self.item.id}/')
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertFalse(Item.objects.filter(id=self.item.id).exists())

#     def test_delete_item_unauthorized(self):
#         response = self.client.delete(f'{self.url}{self.item.id}/')
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# class CustomerViewSetTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.url = '/api/customers/'  # Update the URL as needed
#         self.user = get_user_model().objects.create_user(
#             email='jaw@gmail.com', password='Jawad3102')
#         self.token = Token.objects.create(user=self.user)
#         self.customer_data = {
#             'user': self.user,
#             'name': 'Sample Customer',
#             'code': 'CUST001',
#         }
#         self.customer = Customer.objects.create(**self.customer_data)

#     def test_list_customers(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["count"], 1)
#         self.assertEqual(response.data["next"], None)
#         self.assertEqual(response.data["previous"], None)

#         # Convert the response data (OrderedDict) to a dictionary
#         response_data_dict = dict(response.data["results"][0])
#         for key, value in response_data_dict.items():
#             self.assertEqual(getattr(self.customer, key), value)

#     def test_create_customer(self):
#         self.customer_data = {
#             'name': 'New Customer',
#             'code': 'CUST002',
#         }

#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.post(self.url, self.customer_data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         # Check that a new customer was created
#         self.assertEqual(Customer.objects.count(), 2)

#     def test_create_customer_unauthorized(self):
#         self.customer_data = {
#             'name': 'New Customer',
#             'code': 'CUST002',
#         }
#         response = self.client.post(self.url, self.customer_data)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_create_customer_bad_request(self):
#         self.customer_data = {
#             'name': 'New Customer',
#         }
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.post(self.url, self.customer_data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_retrieve_customer(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.get(f'{self.url}{self.customer.id}/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         serializer = CustomerSerializer(self.customer)
#         self.assertEqual(response.data, serializer.data)

#     def test_retrieve_customer_not_found(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.get(f'{self.url}300/')
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

#     def test_update_customer(self):
#         updated_data = {
#             'name': 'Updated Customer',
#             'code': 'CUST002',
#         }
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.put(
#             f'{self.url}{self.customer.id}/', updated_data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.customer.refresh_from_db()
#         for key, value in updated_data.items():
#             self.assertEqual(getattr(self.customer, key), value)

#     def test_update_customer_bad_request(self):
#         updated_data = {
#             'name': 'Updated Customer',
#         }
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.put(
#             f'{self.url}{self.customer.id}/', updated_data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_update_customer_unauthorized(self):
#         updated_data = {
#             'name': 'Updated Customer',
#             'code': 'CUST002',
#         }
#         response = self.client.put(
#             f'{self.url}{self.customer.id}/', updated_data)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_delete_customer(self):
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
#         response = self.client.delete(f'{self.url}{self.customer.id}/')
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertFalse(Customer.objects.filter(id=self.customer.id).exists())

#     def test_delete_customer_unauthorized(self):
#         response = self.client.delete(f'{self.url}{self.customer.id}/')
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
