import React from 'react';
import {
  IdCard,
  Clock,
  HeartHandshake,
  ClipboardCheck,
  Stethoscope,
  MessageSquare,
  FileSignature,
  ShieldCheck,
  Users,
  UserCheck,
  Scale,
  Sparkles,
} from 'lucide-react';
import { IconName } from '../types/game';

interface IconBadgeProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  name,
  size = 26,
  className = '',
}) => {
  const props = {
    size,
    strokeWidth: 2.2,
    className,
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'id-card':
      return <IdCard {...props} />;
    case 'clock':
      return <Clock {...props} />;
    case 'heart-handshake':
      return <HeartHandshake {...props} />;
    case 'clipboard-check':
      return <ClipboardCheck {...props} />;
    case 'stethoscope':
      return <Stethoscope {...props} />;
    case 'message-square':
      return <MessageSquare {...props} />;
    case 'file-signature':
      return <FileSignature {...props} />;
    case 'shield-check':
      return <ShieldCheck {...props} />;
    case 'users':
      return <Users {...props} />;
    case 'user-check':
      return <UserCheck {...props} />;
    case 'scale':
      return <Scale {...props} />;
    case 'sparkles':
    default:
      return <Sparkles {...props} />;
  }
};
