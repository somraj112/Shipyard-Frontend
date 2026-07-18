import Avatar from '@/components/ui/Avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui';
import { workflowStateMeta } from '@/lib/utils/workflow';
import { formatDate } from '@/lib/utils';
import type { Activity } from '@/types';

const actionVerb: Record<Activity['type'], string> = {
  state_change: 'moved',
  pr_opened: 'opened PR for',
  pr_merged: 'merged PR for',
  comment: 'commented on',
  assigned: 'was assigned to',
};

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <div className="space-y-1">
        {activities.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
            No recent activity
          </p>
        )}
        {activities.map((activity) => {
          const toMeta = activity.to
            ? workflowStateMeta(activity.to as never)
            : null;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg py-2"
            >
              <Avatar name={activity.user.name} size="sm" />
              <div className="flex-1 text-sm">
                <p className="text-[var(--foreground)]">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {actionVerb[activity.type]}{' '}
                  <span className="font-medium text-[var(--foreground)]">
                    {activity.issue.title}
                  </span>
                  {activity.to && toMeta && (
                    <>
                      {' → '}
                      <span
                        className="font-medium"
                        style={{ color: undefined }}
                      >
                        {toMeta.label}
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
