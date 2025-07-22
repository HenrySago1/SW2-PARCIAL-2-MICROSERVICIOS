import 'package:flutter/material.dart';

class DestinosScreen extends StatefulWidget {
  const DestinosScreen({super.key});

  @override
  State<DestinosScreen> createState() => _DestinosScreenState();
}

class _DestinosScreenState extends State<DestinosScreen> {
  bool _loading = false;
  List<Map<String, dynamic>> _destinos = [];
  String? _error;

  // Datos de ejemplo para destinos turísticos
  final List<Map<String, dynamic>> _destinosEjemplo = [
    {
      'id': '1',
      'nombre': 'Copacabana',
      'descripcion':
          'Hermosa ciudad a orillas del Lago Titicaca, conocida por sus playas y la Virgen de Copacabana.',
      'imagen':
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'precio': 'Desde \$50 USD',
      'duracion': '2-3 días',
      'categoria': 'Lago',
      'rating': 4.8,
    },
    {
      'id': '2',
      'nombre': 'Salar de Uyuni',
      'descripcion':
          'El salar más grande del mundo, un desierto de sal que parece infinito.',
      'imagen':
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'precio': 'Desde \$80 USD',
      'duracion': '3-4 días',
      'categoria': 'Desierto',
      'rating': 4.9,
    },
    {
      'id': '3',
      'nombre': 'La Paz',
      'descripcion':
          'La ciudad más alta del mundo, con una mezcla única de tradición y modernidad.',
      'imagen':
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'precio': 'Desde \$40 USD',
      'duracion': '2-3 días',
      'categoria': 'Ciudad',
      'rating': 4.6,
    },
    {
      'id': '4',
      'nombre': 'Sucre',
      'descripcion':
          'La ciudad blanca, capital histórica de Bolivia con arquitectura colonial.',
      'imagen':
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'precio': 'Desde \$35 USD',
      'duracion': '2 días',
      'categoria': 'Ciudad',
      'rating': 4.7,
    },
    {
      'id': '5',
      'nombre': 'Rurrenabaque',
      'descripcion':
          'Puerta de entrada a la Amazonía boliviana, perfecta para ecoturismo.',
      'imagen':
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'precio': 'Desde \$60 USD',
      'duracion': '4-5 días',
      'categoria': 'Selva',
      'rating': 4.5,
    },
  ];

  @override
  void initState() {
    super.initState();
    _cargarDestinos();
  }

  void _cargarDestinos() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      // Por ahora usamos datos de ejemplo
      // En el futuro aquí se haría la consulta GraphQL
      await Future.delayed(const Duration(seconds: 1)); // Simular carga

      setState(() {
        _destinos = _destinosEjemplo;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Error al cargar destinos: ${e.toString()}';
        _loading = false;
      });
    }
  }

  void _reservarDestino(Map<String, dynamic> destino) {
    // Por ahora solo muestra un mensaje
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Próximamente: Reserva para ${destino['nombre']}'),
        backgroundColor: Colors.blue,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Destinos Turísticos'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
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
        child: _loading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(color: Colors.blue),
                    SizedBox(height: 16),
                    Text('Cargando destinos...'),
                  ],
                ),
              )
            : _error != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error_outline,
                            size: 64, color: Colors.red.shade300),
                        const SizedBox(height: 16),
                        Text(
                          _error!,
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.red.shade700),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _cargarDestinos,
                          child: const Text('Reintentar'),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _destinos.length,
                    itemBuilder: (context, index) {
                      final destino = _destinos[index];
                      return _buildDestinoCard(destino);
                    },
                  ),
      ),
    );
  }

  Widget _buildDestinoCard(Map<String, dynamic> destino) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Imagen del destino
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(destino['imagen']),
                  fit: BoxFit.cover,
                ),
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.7),
                    ],
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        destino['nombre'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.star, color: Colors.amber, size: 16),
                          const SizedBox(width: 4),
                          Text(
                            '${destino['rating']}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.blue,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              destino['categoria'],
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          // Información del destino
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  destino['descripcion'],
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.shade700,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Icon(Icons.access_time,
                        color: Colors.blue.shade600, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      destino['duracion'],
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const SizedBox(width: 24),
                    Icon(Icons.attach_money,
                        color: Colors.green.shade600, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      destino['precio'],
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => _reservarDestino(destino),
                    icon: const Icon(Icons.card_travel),
                    label: const Text('Reservar Ahora'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
