import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLConfig {
  // URL para emulador Android (10.0.2.2 apunta a localhost del host)
  // URL para dispositivo físico sería la IP de tu computadora
  static const String baseUrl = 'http://192.168.0.34:8081/graphql';

  static HttpLink httpLink = HttpLink(baseUrl);

  static ValueNotifier<GraphQLClient> client = ValueNotifier(
    GraphQLClient(
      link: httpLink,
      cache: GraphQLCache(store: InMemoryStore()),
    ),
  );

  static const String actualizarFcmTokenMutation = '''
mutation ActualizarFcmToken(
  \$id: ID!,
  \$fcmToken: String!
) {
  actualizarFcmToken(id: \$id, fcmToken: \$fcmToken) {
    id
    nombre
    email
    fcmToken
  }
}
''';
}
