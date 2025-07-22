import 'package:flutter/material.dart';

import 'destinos_screen.dart';
import 'reservas_screen.dart';

class HomeScreen extends StatelessWidget {
  final String userName;
  final String? userId;
  final String? userEmail;

  const HomeScreen({
    super.key,
    required this.userName,
    this.userId,
    this.userEmail,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TURISAGO'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue.shade700,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, size: 36, color: Colors.blue),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    userName,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    userEmail ?? 'Cliente TURISAGO',
                    style: const TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.place_outlined),
              title: const Text('Destinos turísticos'),
              subtitle: const Text('Explora nuestros destinos'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DestinosScreen(),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.card_travel),
              title: const Text('Mis reservas'),
              subtitle: const Text('Gestiona tus reservas'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ReservasScreen(
                      userId: userId,
                      userName: userName,
                    ),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.local_offer),
              title: const Text('Ofertas y paquetes'),
              subtitle: const Text('Descubre ofertas especiales'),
              onTap: () {
                // TODO: Implementar navegación a ofertas
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text('Próximamente: Ofertas y paquetes')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.notifications),
              title: const Text('Notificaciones'),
              subtitle: const Text('Mantente informado'),
              onTap: () {
                // TODO: Implementar navegación a notificaciones
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Próximamente: Notificaciones')),
                );
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Cerrar sesión'),
              onTap: () {
                Navigator.of(context).pop();
                Navigator.of(context).pushReplacementNamed('/');
              },
            ),
          ],
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade50,
              Colors.white,
            ],
          ),
        ),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.travel_explore,
                  size: 80,
                  color: Colors.blue.shade400,
                ),
                const SizedBox(height: 24),
                Text(
                  '¡Bienvenido, $userName!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Tu aplicación de turismo favorita',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 32),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'Funcionalidades disponibles:',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildFeatureItem(
                          Icons.place_outlined, 'Explorar destinos'),
                      _buildFeatureItem(
                          Icons.card_travel, 'Gestionar reservas'),
                      _buildFeatureItem(Icons.local_offer, 'Ver ofertas'),
                      _buildFeatureItem(
                          Icons.notifications, 'Recibir notificaciones'),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Selecciona una opción en el menú lateral',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade500,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue.shade600, size: 20),
          const SizedBox(width: 12),
          Text(
            text,
            style: const TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }
}
