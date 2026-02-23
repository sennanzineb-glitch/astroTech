import 'package:flutter/material.dart';

import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/date_formatter.dart';
import '../../domain/entities/intervention.dart';

class InterventionCard extends StatelessWidget {
  final Intervention intervention;
  final VoidCallback onTap;

  const InterventionCard({
    super.key,
    required this.intervention,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: AppDimensions.elevationMd,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(AppDimensions.cardPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row: Title + Status badge
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      intervention.titre,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: AppTypography.semiBold,
                            color: AppColors.textPrimary,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  SizedBox(width: AppDimensions.spaceSm),
                  _buildStatusBadge(),
                ],
              ),

              SizedBox(height: AppDimensions.spaceSm),

              // Type and priority row
              Row(
                children: [
                  _buildPriorityBadge(),
                  SizedBox(width: AppDimensions.spaceSm),
                  Text(
                    intervention.type,
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: AppTypography.caption,
                      fontWeight: AppTypography.medium,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '#${intervention.numero}',
                    style: TextStyle(
                      color: AppColors.textHint,
                      fontSize: AppTypography.caption,
                    ),
                  ),
                ],
              ),

              SizedBox(height: AppDimensions.spaceMd),

              // Client name (if available)
              if (intervention.clientNom != null &&
                  intervention.clientNom!.isNotEmpty) ...[
                Row(
                  children: [
                    Icon(
                      Icons.person_outline,
                      size: AppDimensions.iconSm,
                      color: AppColors.accent,
                    ),
                    SizedBox(width: AppDimensions.spaceSm),
                    Expanded(
                      child: Text(
                        intervention.clientNom!,
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: AppTypography.body,
                          fontWeight: AppTypography.medium,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: AppDimensions.spaceSm),
              ],

              // Date & Time
              Row(
                children: [
                  Icon(
                    Icons.calendar_today_outlined,
                    size: AppDimensions.iconSm,
                    color: AppColors.textSecondary,
                  ),
                  SizedBox(width: AppDimensions.spaceSm),
                  Text(
                    DateFormatter.formatDateTime(intervention.datePrevue),
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: AppTypography.caption,
                    ),
                  ),
                  if (intervention.dureePrevueHeures != null) ...[
                    SizedBox(width: AppDimensions.spaceMd),
                    Icon(
                      Icons.access_time,
                      size: AppDimensions.iconSm,
                      color: AppColors.textSecondary,
                    ),
                    SizedBox(width: AppDimensions.spaceXs),
                    Text(
                      '${intervention.dureePrevueHeures}h${intervention.dureePrevueMinutes ?? 0}',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: AppTypography.caption,
                      ),
                    ),
                  ],
                ],
              ),

              // Address
              if (intervention.address != null &&
                  intervention.address!.fullAddress.isNotEmpty) ...[
                SizedBox(height: AppDimensions.spaceSm),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: AppDimensions.iconSm,
                      color: AppColors.accent,
                    ),
                    SizedBox(width: AppDimensions.spaceSm),
                    Expanded(
                      child: Text(
                        intervention.address!.fullAddress,
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: AppTypography.caption,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],

              // Description
              if (intervention.description != null &&
                  intervention.description!.isNotEmpty) ...[
                SizedBox(height: AppDimensions.spaceMd),
                Container(
                  padding: EdgeInsets.all(AppDimensions.spaceMd),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                    border: Border.all(color: AppColors.divider),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        Icons.description_outlined,
                        size: AppDimensions.iconSm,
                        color: AppColors.textSecondary,
                      ),
                      SizedBox(width: AppDimensions.spaceSm),
                      Expanded(
                        child: Text(
                          intervention.description!,
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: AppTypography.caption,
                            height: 1.4,
                          ),
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              // Workflow progress
              if (intervention.isStarted || intervention.currentStep > 1) ...[
                SizedBox(height: AppDimensions.spaceMd),
                _buildWorkflowProgress(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge() {
    Color color;
    String label;

    switch (intervention.etat) {
      case 'planifie':
        color = AppColors.statusPlanifie;
        label = 'Planifiée';
        break;
      case 'en_cours':
        color = AppColors.statusEnCours;
        label = 'En cours';
        break;
      case 'termine':
        color = AppColors.statusTermine;
        label = 'Terminée';
        break;
      case 'non_validee':
        color = AppColors.statusNonValidee;
        label = 'Non validée';
        break;
      default:
        color = AppColors.textHint;
        label = intervention.etat ?? 'Inconnu';
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: AppDimensions.spaceSm + 2,
        vertical: AppDimensions.spaceXs,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
        border: Border.all(color: color.withValues(alpha: 0.5)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: AppTypography.small,
          fontWeight: AppTypography.semiBold,
        ),
      ),
    );
  }

  Widget _buildPriorityBadge() {
    Color color;
    String label;

    switch (intervention.priorite?.toLowerCase()) {
      case 'urgent':
      case 'urgente':
        color = AppColors.priorityUrgent;
        label = 'Urgent';
        break;
      case 'haute':
      case 'high':
        color = AppColors.priorityHigh;
        label = 'Haute';
        break;
      case 'normale':
      case 'normal':
        color = AppColors.priorityNormal;
        label = 'Normale';
        break;
      default:
        color = AppColors.priorityLow;
        label = 'Basse';
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: AppDimensions.spaceSm,
        vertical: 2,
      ),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(AppDimensions.radiusXs),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: Colors.white,
          fontSize: AppTypography.small,
          fontWeight: AppTypography.semiBold,
        ),
      ),
    );
  }

  Widget _buildWorkflowProgress() {
    final currentStep = intervention.currentStep;

    return Container(
      padding: EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.trending_up,
                size: AppDimensions.iconSm,
                color: AppColors.primary,
              ),
              SizedBox(width: AppDimensions.spaceXs),
              Text(
                'Progression: ',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: AppTypography.caption,
                  fontWeight: AppTypography.medium,
                ),
              ),
              Text(
                '$currentStep/6',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: AppTypography.caption,
                  fontWeight: AppTypography.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: AppDimensions.spaceSm),
          Row(
            children: List.generate(6, (index) {
              final step = index + 1;
              final isComplete = step < currentStep;
              final isCurrent = step == currentStep;

              return Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(
                    right: index < 5 ? AppDimensions.spaceXs - 1 : 0,
                  ),
                  decoration: BoxDecoration(
                    color: isComplete
                        ? AppColors.stepComplete
                        : isCurrent
                            ? AppColors.stepCurrent
                            : AppColors.stepPending,
                    borderRadius: BorderRadius.circular(AppDimensions.radiusXs / 2),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
