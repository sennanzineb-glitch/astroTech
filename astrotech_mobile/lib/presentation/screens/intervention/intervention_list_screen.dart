import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_strings.dart';
import '../../../domain/entities/intervention.dart';
import '../../../injection_container.dart';
import '../../../services/connectivity_service.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/intervention/intervention_bloc.dart';
import '../../widgets/intervention_card.dart';
import '../../widgets/sync_indicator.dart';
import 'intervention_detail_screen.dart';

class InterventionListScreen extends StatefulWidget {
  const InterventionListScreen({super.key});

  @override
  State<InterventionListScreen> createState() => _InterventionListScreenState();
}

class _InterventionListScreenState extends State<InterventionListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<InterventionBloc>().add(const LoadInterventions());
  }

  Future<void> _handleRefresh() async {
    context.read<InterventionBloc>().add(const LoadInterventions(forceRefresh: true));
    // Wait a bit for the state to update
    await Future.delayed(const Duration(milliseconds: 500));
  }

  void _handleLogout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(AppStrings.logout),
        content: const Text(AppStrings.confirmLogout),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(AppStrings.cancel),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<AuthBloc>().add(LogoutRequested());
            },
            child: Text(
              AppStrings.logout,
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToDetail(Intervention intervention) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => InterventionDetailScreen(
          interventionId: intervention.id,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.interventions),
        actions: [
          const SyncIndicator(),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
            tooltip: AppStrings.logout,
          ),
        ],
      ),
      body: Column(
        children: [
          // Connectivity indicator
          StreamBuilder<bool>(
            stream: getIt<ConnectivityService>().connectivityStream,
            builder: (context, snapshot) {
              final isOnline = snapshot.data ?? true;
              if (!isOnline) {
                return Container(
                  width: double.infinity,
                  color: AppColors.offline,
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.wifi_off, size: 16, color: Colors.white),
                      SizedBox(width: 8),
                      Text(
                        AppStrings.offlineMode,
                        style: TextStyle(color: Colors.white, fontSize: 12),
                      ),
                    ],
                  ),
                );
              }
              return const SizedBox.shrink();
            },
          ),

          // Intervention list
          Expanded(
            child: BlocBuilder<InterventionBloc, InterventionState>(
              builder: (context, state) {
                if (state is InterventionLoading) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                if (state is InterventionError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: AppColors.error,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          state.message,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _handleRefresh,
                          icon: const Icon(Icons.refresh),
                          label: const Text(AppStrings.retry),
                        ),
                      ],
                    ),
                  );
                }

                List<Intervention> interventions = [];
                bool isRefreshing = false;

                if (state is InterventionsLoaded) {
                  // Filter out completed interventions (both by status and workflow)
                  interventions = state.interventions
                      .where((intervention) =>
                          intervention.etat != 'termine' &&
                          intervention.etat != 'terminee' &&
                          !intervention.isCompleted)
                      .toList();
                  isRefreshing = state.isRefreshing;
                }

                if (interventions.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.assignment_outlined,
                          size: 64,
                          color: AppColors.textHint,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          AppStrings.noInterventions,
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _handleRefresh,
                          icon: const Icon(Icons.refresh),
                          label: const Text(AppStrings.refresh),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: _handleRefresh,
                  child: Stack(
                    children: [
                      ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: interventions.length,
                        itemBuilder: (context, index) {
                          final intervention = interventions[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: InterventionCard(
                              intervention: intervention,
                              onTap: () => _navigateToDetail(intervention),
                            ),
                          );
                        },
                      ),
                      if (isRefreshing)
                        const Positioned(
                          top: 0,
                          left: 0,
                          right: 0,
                          child: LinearProgressIndicator(),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
