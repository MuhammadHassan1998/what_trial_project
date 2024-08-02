from django.urls import path
from .views import SignupView, LoginView, ProductView, SelectProductView, LogoutView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/', ProductView.as_view(), name='product-list-add'),
    path('select-product/<int:pk>/', SelectProductView.as_view(), name='select-product'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
