import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_config.dart';
import '../utils/network_utils.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _loading = false;
  String? _error;

  final String loginQuery = r'''
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        success
        message
        usuario {
          id
          nombre
          email
          rol
          activo
        }
        token
      }
    }
  ''';

  void _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      // Verificar conexión a internet
      final hasInternet = await NetworkUtils.checkInternetConnection();
      if (!hasInternet) {
        setState(() {
          _loading = false;
          _error = 'Sin conexión a internet. Verifica tu conexión.';
        });
        return;
      }

      final client = GraphQLConfig.client.value;
      final result = await client
          .query(QueryOptions(
        document: gql(loginQuery),
        variables: {
          'email': _emailController.text.trim(),
          'password': _passwordController.text.trim(),
        },
      ))
          .timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw Exception('Tiempo de espera agotado');
        },
      );

      setState(() {
        _loading = false;
      });

      if (result.hasException) {
        final errorMessage = NetworkUtils.getErrorMessage(result.exception);
        setState(() {
          _error = errorMessage;
        });
        return;
      }

      final loginData = result.data?['login'];
      if (loginData == null) {
        setState(() {
          _error = 'Error en la respuesta del servidor';
        });
        return;
      }

      final success = loginData['success'] as bool?;
      final message = loginData['message'] as String?;
      final usuario = loginData['usuario'];

      if (success != true || usuario == null) {
        setState(() {
          _error = message ?? 'Credenciales incorrectas';
        });
        return;
      }

      // Verificar que el usuario esté activo
      final activo = usuario['activo'] as bool?;
      if (activo != true) {
        setState(() {
          _error = 'Usuario inactivo. Contacte al administrador.';
        });
        return;
      }

      // Verificar que sea un cliente
      final rol = usuario['rol'] as String?;
      if (rol != 'CLIENTE') {
        setState(() {
          _error = 'Acceso denegado. Solo clientes pueden usar la app móvil.';
        });
        return;
      }

      // === NUEVO: Enviar el token FCM al backend ===
      try {
        final fcmToken = await FirebaseMessaging.instance.getToken();
        if (fcmToken != null && usuario['id'] != null) {
          await client.mutate(MutationOptions(
            document: gql(GraphQLConfig.actualizarFcmTokenMutation),
            variables: {
              'id': usuario['id'].toString(),
              'fcmToken': fcmToken,
            },
          ));
        }
      } catch (e) {
        print('Error al actualizar el token FCM: $e');
      }
      // === FIN NUEVO ===

      // Obtener el id del usuario logueado
      final usuarioId = usuario['id']?.toString();

      // Consulta GraphQL para obtener el cliente asociado a este usuario
      final String getClienteQuery = '''
        query ClientePorUsuario {
          clientes {
            id
            usuarioId
            nombre
            email
          }
        }
      ''';
      final clienteResult = await client.query(QueryOptions(
        document: gql(getClienteQuery),
      ));
      String? clienteId;
      if (clienteResult.hasException) {
        print(
            'Error al obtener cliente: ' + clienteResult.exception.toString());
      } else {
        final clientes = clienteResult.data?['clientes'] as List?;
        if (clientes != null) {
          final cliente = clientes.firstWhere(
            (c) => c['usuarioId']?.toString() == usuarioId,
            orElse: () => null,
          );
          if (cliente != null) {
            clienteId = cliente['id']?.toString();
          }
        }
      }

      // Guardar el context antes de la operación async
      final currentContext = context;

      // Mostrar mensaje de éxito
      NetworkUtils.showSuccessSnackBar(
          currentContext, '¡Bienvenido, ${usuario['nombre']}!');

      // Navegar a HomeScreen con el id de cliente (no usuario)
      Navigator.pushReplacement(
        currentContext,
        MaterialPageRoute(
          builder: (_) => HomeScreen(
            userName: usuario['nombre'] ?? 'Usuario',
            userId: clienteId, // Ahora es el id de cliente
            userEmail: usuario['email'],
          ),
        ),
      );
    } catch (e) {
      setState(() {
        _loading = false;
        _error = NetworkUtils.getErrorMessage(e);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F6FF),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.blue.withOpacity(0.08),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Logo TURISAGO
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    child: CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.blue.shade100,
                      child: const Icon(Icons.travel_explore,
                          size: 48, color: Colors.blue),
                    ),
                  ),
                  const Text('Bienvenido a TURISAGO',
                      style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue)),
                  const SizedBox(height: 8),
                  const Text('Inicia sesión para continuar',
                      style: TextStyle(color: Colors.black54)),
                  const SizedBox(height: 32),
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                      prefixIcon: const Icon(Icons.email_outlined),
                      filled: true,
                      fillColor: Colors.blue.shade50,
                    ),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Ingrese su email' : null,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(
                      labelText: 'Contraseña',
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                      prefixIcon: const Icon(Icons.lock_outline),
                      filled: true,
                      fillColor: Colors.blue.shade50,
                    ),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Ingrese su contraseña' : null,
                    obscureText: true,
                  ),
                  const SizedBox(height: 24),
                  if (_error != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red.shade200),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.error_outline,
                                color: Colors.red.shade600, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _error!,
                                style: TextStyle(color: Colors.red.shade700),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        textStyle: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      onPressed: _loading ? null : _login,
                      child: _loading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white))
                          : const Text('Ingresar'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.blue.shade200),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Credenciales de prueba:',
                          style: TextStyle(
                            color: Colors.blue.shade700,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Email: melinaescobar@turisago.com\nContraseña: secret123',
                          style: TextStyle(
                            color: Colors.blue.shade600,
                            fontSize: 11,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
