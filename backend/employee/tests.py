import os
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.test import TestCase, override_settings, RequestFactory
from mock import patch
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

class EmployeeTest(APITestCase):
    """ Test module for Employee api """

    def setUp(self):
        # self.test_user = User.objects.create(
        #     username="testUser@gmail.com",
        #     email="testUser",
        #     is_superuser = True,
        #     is_active = True,
        #     is_staff = True)
        # self.test_user.set_password('test987654321')
        # self.test_user.save()

        self.superuser = User.objects.create_superuser('testUser', 'testUser@gmail.com', 'test987654321')
        
        # self.test_user_token, created = Token.objects.get_or_create(
        #     user=self.test_user)
        print()

    @patch("pandas.read_csv")
    def test_upload_csv_success(self, mock_read_csv):
        base_path = os.path.dirname(os.path.realpath(__file__))
        file_name = "time-report-01.csv"
        file_path = os.path.join(base_path, "test_file", file_name)
        
        uploadf_file = open(file_path, 'rb')
        content_type = 'multipart/form-data'
        data = SimpleUploadedFile(content = uploadf_file.read(), name = uploadf_file.name, content_type = content_type)
        
        self.client = APIClient()
        self.client.login(username='testUser', password='test987654321')
        response = self.client.post('/api/v1/empl/file_upload',{'file': data },  format='multipart')
        mock_read_csv.return_value = True
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(len(response.data) > 0)

    @patch("pandas.read_csv")
    def test_upload_csv_failed_invalid_name(self, mock_read_csv):
        base_path = os.path.dirname(os.path.realpath(__file__))
        file_name = "sample.csv"
        file_path = os.path.join(base_path, "test_file", file_name)
        
        uploadf_file = open(file_path, 'rb')
        content_type = 'multipart/form-data'
        data = SimpleUploadedFile(content = uploadf_file.read(), name = uploadf_file.name, content_type = content_type)
        
        self.client = APIClient()
        self.client.login(username='testUser', password='test987654321')
        response = self.client.post('/api/v1/empl/file_upload',{'file': data },  format='multipart')
        mock_read_csv.return_value = True
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], "Invalid file name")