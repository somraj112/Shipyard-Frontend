import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui';
import type { User, UserRole } from '@/types';

const roleBadgeVariant: Record<UserRole, 'neutral' | 'blue' | 'purple'> = {
  org_admin: 'purple',
  manager: 'blue',
  team_lead: 'blue',
  engineer: 'neutral',
  product_manager: 'purple',
};

const roleLabel: Record<UserRole, string> = {
  org_admin: 'Admin',
  manager: 'Manager',
  team_lead: 'Team Lead',
  engineer: 'Engineer',
  product_manager: 'Product',
};

export default function TeamList({ members }: { members: User[] }) {
  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <span className="text-xs text-[var(--muted-foreground)]">
          {members.length} members
        </span>
      </CardHeader>
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar name={member.name} src={member.avatarUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">
                {member.email}
              </p>
            </div>
            <Badge variant={roleBadgeVariant[member.role]}>
              {roleLabel[member.role]}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
