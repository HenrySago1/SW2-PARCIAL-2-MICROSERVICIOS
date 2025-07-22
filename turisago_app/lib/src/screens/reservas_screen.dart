import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_config.dart';
import '../utils/network_utils.dart';

class ReservasScreen extends StatefulWidget {
  final String? userId;
  final String? userName;

  const ReservasScreen({
    super.key,
    this.userId,
    this.userName,
  });

  @override
  State<ReservasScreen> createState() => _ReservasScreenState();
}

class _ReservasScreenState extends State<ReservasScreen> {
  bool _loading = false;
  List<Map<String, dynamic>> _reservas = [];
  String? _error;

  // Query GraphQL para obtener reservas SOLO del usuario logueado
  final String _getReservasQuery = r'''
    query GetReservasAlojamiento(
      $clienteId: ID
    ) {
      reservasAlojamiento(clienteId: $clienteId) {
        id
        habitacionId
        clienteId
        fechaInicio
        fechaFin
        montoTotal
        estado
      }
    }
  ''';

  @override
  void initState() {
    super.initState();
    _cargarReservas();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // print('DEBUG: clienteId usado en la app: [32m${widget.userId}[0m');
    _cargarReservas();
  }

  Future<void> _cargarReservas() async {
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
        document: gql(_getReservasQuery),
        variables: {'clienteId': widget.userId},
        fetchPolicy: FetchPolicy.networkOnly,
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

      final reservasData = result.data?['reservasAlojamiento'] as List?;
      if (reservasData == null) {
        setState(() {
          _error = 'Error en la respuesta del servidor';
        });
        return;
      }

      // Filtrar reservas del usuario actual si tenemos userId
      List<Map<String, dynamic>> reservasFiltradas = [];
      for (var reserva in reservasData) {
        if (widget.userId == null || reserva['clienteId'] == widget.userId) {
          // Transformar datos para la UI con campos simplificados
          reservasFiltradas.add({
            'id': reserva['id'],
            'destino': 'Destino Turístico', // Valor por defecto
            'fechaInicio': reserva['fechaInicio'],
            'fechaFin': reserva['fechaFin'],
            'estado': reserva['estado'] ?? 'PENDIENTE',
            'precio': reserva['montoTotal']?.toDouble() ?? 0.0,
            'personas': 2, // Valor por defecto
            'tipoHabitacion': 'Habitación Estándar', // Valor por defecto
            'hotel': 'Hotel Turisago', // Valor por defecto
            'imagen':
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          });
        }
      }

      setState(() {
        _reservas = reservasFiltradas;
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = NetworkUtils.getErrorMessage(e);
      });
    }
  }

  String _getImagenPorDestino(String nombreDestino) {
    // Mapeo de destinos a imágenes
    final Map<String, String> imagenesDestinos = {
      'Copacabana':
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'Salar de Uyuni':
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'La Paz':
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'Sucre':
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'Rurrenabaque':
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    };

    return imagenesDestinos[nombreDestino] ??
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
  }

  Color _getEstadoColor(String estado) {
    switch (estado.toUpperCase()) {
      case 'CONFIRMADA':
        return Colors.green;
      case 'PENDIENTE':
        return Colors.orange;
      case 'COMPLETADA':
        return Colors.blue;
      case 'CANCELADA':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getEstadoIcon(String estado) {
    switch (estado.toUpperCase()) {
      case 'CONFIRMADA':
        return Icons.check_circle;
      case 'PENDIENTE':
        return Icons.schedule;
      case 'COMPLETADA':
        return Icons.done_all;
      case 'CANCELADA':
        return Icons.cancel;
      default:
        return Icons.info;
    }
  }

  void _verDetalleReserva(Map<String, dynamic> reserva) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Detalle de Reserva'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Destino: ${reserva['destino']}'),
            Text('Hotel: ${reserva['hotel']}'),
            Text('Habitación: ${reserva['tipoHabitacion']}'),
            Text('Personas: ${reserva['personas']}'),
            Text('Fecha: ${reserva['fechaInicio']} - ${reserva['fechaFin']}'),
            Text('Precio: \$${reserva['precio']} USD'),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _getEstadoColor(reserva['estado']),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                reserva['estado'],
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    );
  }

  void _cancelarReserva(Map<String, dynamic> reserva) async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancelar Reserva'),
        content: Text(
            '¿Estás seguro de que quieres cancelar tu reserva a ${reserva['destino']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);

              try {
                // Mutation para actualizar el estado de la reserva
                final String updateReservaMutation = r'''
                  mutation ActualizarReservaAlojamiento($id: ID!, $habitacionId: ID!, $clienteId: ID!, $fechaInicio: String!, $fechaFin: String!, $montoTotal: Float!, $estado: String!) {
                    actualizarReservaAlojamiento(
                      id: $id
                      habitacionId: $habitacionId
                      clienteId: $clienteId
                      fechaInicio: $fechaInicio
                      fechaFin: $fechaFin
                      montoTotal: $montoTotal
                      estado: $estado
                    ) {
                      id
                      estado
                    }
                  }
                ''';

                final client = GraphQLConfig.client.value;
                final result = await client.mutate(MutationOptions(
                  document: gql(updateReservaMutation),
                  variables: {
                    'id': reserva['id'],
                    'habitacionId': reserva['habitacion']['id'],
                    'clienteId': reserva['cliente']['id'],
                    'fechaInicio': reserva['fechaInicio'],
                    'fechaFin': reserva['fechaFin'],
                    'montoTotal': reserva['precio'],
                    'estado': 'CANCELADA',
                  },
                ));

                if (result.hasException) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                          'Error al cancelar reserva: ${result.exception.toString()}'),
                      backgroundColor: Colors.red,
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Reserva cancelada: ${reserva['destino']}'),
                      backgroundColor: Colors.orange,
                    ),
                  );
                  // Recargar reservas
                  _cargarReservas();
                }
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Error al cancelar reserva: ${e.toString()}'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text('Sí, cancelar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mis Reservas')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text('DEBUG: clienteId usado en la app: ${widget.userId}',
                style: const TextStyle(fontSize: 12, color: Colors.red)),
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                await _cargarReservas();
              },
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _error != null
                      ? Center(child: Text(_error!))
                      : _reservas.isEmpty
                          ? const Center(child: Text('No tienes reservas.'))
                          : ListView.builder(
                              itemCount: _reservas.length,
                              itemBuilder: (context, index) {
                                final reserva = _reservas[index];
                                return _buildReservaCard(reserva);
                              },
                            ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReservaCard(Map<String, dynamic> reserva) {
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
              height: 150,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(reserva['imagen']),
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
                        reserva['destino'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            _getEstadoIcon(reserva['estado']),
                            color: _getEstadoColor(reserva['estado']),
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            reserva['estado'],
                            style: TextStyle(
                              color: _getEstadoColor(reserva['estado']),
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
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
          // Información de la reserva
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.hotel, color: Colors.blue.shade600, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        reserva['hotel'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.calendar_today,
                        color: Colors.green.shade600, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      '${reserva['fechaInicio']} - ${reserva['fechaFin']}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.people, color: Colors.orange.shade600, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      '${reserva['personas']} personas - ${reserva['tipoHabitacion']}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(Icons.attach_money,
                        color: Colors.green.shade600, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      '\$${reserva['precio']} USD',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.green.shade700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _verDetalleReserva(reserva),
                        icon: const Icon(Icons.info_outline),
                        label: const Text('Ver Detalle'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.blue,
                          side: const BorderSide(color: Colors.blue),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: reserva['estado'] == 'CONFIRMADA' ||
                                reserva['estado'] == 'PENDIENTE'
                            ? () => _cancelarReserva(reserva)
                            : null,
                        icon: const Icon(Icons.cancel),
                        label: const Text('Cancelar'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
