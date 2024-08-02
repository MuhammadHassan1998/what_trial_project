from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Product
from .serializers import UserSerializer, ProductSerializer
from rest_framework.pagination import PageNumberPagination

User = get_user_model()

class SignupView(generics.CreateAPIView):
    """
    API view to handle user signup.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginView(APIView):
    """
    API view to handle user login.
    """
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()
        
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({'username': username, 'email': user.email, 'refresh': str(refresh), 'access': str(refresh.access_token)})
        
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ProductView(APIView):
    """
    API view to handle product-related operations.
    - GET: Search for products (with pagination)
    - POST: Add a new product
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        """
        Search for products.
        """
        queryset = Product.objects.all()
        query = request.query_params.get('query', None)
        
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Add a new product.
        """
        serializer = ProductSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SelectProductView(APIView):
    """
    API view to select a product.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.selected = not product.selected
            product.save()
            return Response({'status': 'Product selected'})
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
