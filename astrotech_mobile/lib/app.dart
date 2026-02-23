import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/constants/app_colors.dart';
import 'core/constants/app_dimensions.dart';
import 'core/constants/app_typography.dart';
import 'injection_container.dart';
import 'presentation/blocs/auth/auth_bloc.dart';
import 'presentation/blocs/intervention/intervention_bloc.dart';
import 'presentation/screens/auth/login_screen.dart';
import 'presentation/screens/intervention/intervention_list_screen.dart';
import 'services/connectivity_service.dart';

class AstroTechApp extends StatelessWidget {
  const AstroTechApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<AuthBloc>()..add(CheckAuthStatus())),
        BlocProvider(create: (_) => getIt<InterventionBloc>()),
      ],
      child: MaterialApp(
        title: 'AstroTech Mobile',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            primary: AppColors.primary,
            secondary: AppColors.accent,
            error: AppColors.error,
            background: AppColors.background,
            surface: AppColors.surface,
          ),

          // Enhanced AppBar with Solitech navy branding
          appBarTheme: AppBarTheme(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: AppDimensions.elevationMd,
            centerTitle: false,
            titleTextStyle: TextStyle(
              fontSize: AppTypography.h4,
              fontWeight: AppTypography.semiBold,
              color: Colors.white,
            ),
            iconTheme: const IconThemeData(color: Colors.white),
          ),

          // Enhanced Cards with better hierarchy
          cardTheme: CardThemeData(
            elevation: AppDimensions.elevationMd,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
              side: BorderSide(color: AppColors.cardBorder, width: 1),
            ),
            shadowColor: AppColors.cardShadow,
            color: AppColors.surface,
          ),

          // Enhanced Buttons
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              minimumSize: Size(double.infinity, AppDimensions.buttonHeightMd),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              ),
              elevation: AppDimensions.elevationSm,
              textStyle: TextStyle(
                fontSize: AppTypography.body,
                fontWeight: AppTypography.semiBold,
              ),
              padding: EdgeInsets.symmetric(
                horizontal: AppDimensions.spaceLg,
                vertical: AppDimensions.spaceMd,
              ),
            ),
          ),

          outlinedButtonTheme: OutlinedButtonThemeData(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.primary,
              minimumSize: Size(double.infinity, AppDimensions.buttonHeightMd),
              side: BorderSide(color: AppColors.primary, width: AppDimensions.borderMedium),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              ),
              textStyle: TextStyle(
                fontSize: AppTypography.body,
                fontWeight: AppTypography.semiBold,
              ),
              padding: EdgeInsets.symmetric(
                horizontal: AppDimensions.spaceLg,
                vertical: AppDimensions.spaceMd,
              ),
            ),
          ),

          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              foregroundColor: AppColors.primary,
              textStyle: TextStyle(
                fontSize: AppTypography.body,
                fontWeight: AppTypography.medium,
              ),
            ),
          ),

          // Input Fields
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: AppColors.surface,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              borderSide: BorderSide(color: AppColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              borderSide: BorderSide(color: AppColors.divider),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              borderSide: BorderSide(color: AppColors.primary, width: AppDimensions.borderMedium),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              borderSide: BorderSide(color: AppColors.error),
            ),
            contentPadding: EdgeInsets.symmetric(
              horizontal: AppDimensions.spaceMd,
              vertical: AppDimensions.spaceMd,
            ),
          ),

          // Divider
          dividerTheme: DividerThemeData(
            color: AppColors.divider,
            thickness: AppDimensions.borderThin,
            space: AppDimensions.spaceMd,
          ),

          // Bottom Sheet
          bottomSheetTheme: BottomSheetThemeData(
            backgroundColor: AppColors.surface,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(AppDimensions.radiusLg),
              ),
            ),
          ),
        ),
        home: StreamBuilder<bool>(
          stream: getIt<ConnectivityService>().connectivityStream,
          builder: (context, snapshot) {
            return BlocBuilder<AuthBloc, AuthState>(
              builder: (context, state) {
                if (state is AuthLoading) {
                  return const Scaffold(
                    body: Center(
                      child: CircularProgressIndicator(),
                    ),
                  );
                }

                if (state is Authenticated) {
                  return const InterventionListScreen();
                }

                return const LoginScreen();
              },
            );
          },
        ),
      ),
    );
  }
}
