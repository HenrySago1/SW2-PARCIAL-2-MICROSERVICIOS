// Firebase core y opciones
import 'package:firebase_core/firebase_core.dart';
// Firebase Messaging
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
// Para mostrar notificaciones locales
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'firebase_options.dart';
import 'src/graphql/graphql_config.dart';
import 'src/screens/login_screen.dart';

// Función para manejar mensajes en segundo plano (debe ser de nivel superior)
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Asegurar que Firebase esté inicializado
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  print('Handling a background message: ${message.messageId}');
  print('Message data: ${message.data}');
  print('Message notification: ${message.notification?.title}');
  print('Message notification: ${message.notification?.body}');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializar Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Inicializar GraphQL
  await initHiveForFlutter();

  // Configuración inicial de FCM
  // Solicitar permisos para notificaciones (Android 13+ y iOS)
  await FirebaseMessaging.instance.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  // Configurar el handler para mensajes en segundo plano
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Configurar notificaciones locales
  await _initializeLocalNotifications();

  // Escuchar mensajes en primer plano
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print('Handling a foreground message: ${message.messageId}');
    print('Message data: ${message.data}');
    print('Message notification: ${message.notification?.title}');
    print('Message notification: ${message.notification?.body}');

    // Mostrar notificación local cuando la app está en primer plano
    _showLocalNotification(message);
  });

  // Escuchar cuando se abre la app desde una notificación
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    print('App opened from notification: ${message.messageId}');
    // Aquí puedes navegar a una pantalla específica basada en el mensaje
    // Por ejemplo: Navigator.pushNamed(context, '/reservas');
  });

  // Obtener el token FCM (útil para enviar notificaciones específicas)
  String? token = await FirebaseMessaging.instance.getToken();
  print('FCM Token: $token');

  runApp(const TurisagoApp());
}

// Inicializar notificaciones locales
Future<void> _initializeLocalNotifications() async {
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  const AndroidInitializationSettings initializationSettingsAndroid =
      AndroidInitializationSettings('@mipmap/ic_launcher');

  const DarwinInitializationSettings initializationSettingsIOS =
      DarwinInitializationSettings();

  const InitializationSettings initializationSettings = InitializationSettings(
    android: initializationSettingsAndroid,
    iOS: initializationSettingsIOS,
  );

  await flutterLocalNotificationsPlugin.initialize(
    initializationSettings,
    onDidReceiveNotificationResponse: (NotificationResponse response) {
      // Manejar cuando se toca una notificación local
      print('Notification tapped: ${response.payload}');
    },
  );
}

// Mostrar notificación local
void _showLocalNotification(RemoteMessage message) {
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  const AndroidNotificationDetails androidPlatformChannelSpecifics =
      AndroidNotificationDetails(
    'turisago_channel',
    'TURISAGO Notifications',
    channelDescription: 'Canal para notificaciones de TURISAGO',
    importance: Importance.max,
    priority: Priority.high,
  );

  const NotificationDetails platformChannelSpecifics =
      NotificationDetails(android: androidPlatformChannelSpecifics);

  flutterLocalNotificationsPlugin.show(
    message.hashCode,
    message.notification?.title ?? 'TURISAGO',
    message.notification?.body ?? 'Nueva notificación',
    platformChannelSpecifics,
    payload: message.data.toString(),
  );
}

class TurisagoApp extends StatelessWidget {
  const TurisagoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GraphQLProvider(
      client: GraphQLConfig.client,
      child: MaterialApp(
        title: 'TURISAGO',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.blue,
            foregroundColor: Colors.white,
            elevation: 0,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ),
        home: const LoginScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
