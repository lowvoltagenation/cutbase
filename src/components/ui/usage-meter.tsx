import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowUp, AlertTriangle } from "lucide-react";
import { SubscriptionTier } from "@/types/subscription";
import Link from "next/link";

interface UsageMeterProps {
  metricName: string;
  current: number;
  limit: number | null; // null = unlimited
  tier: SubscriptionTier;
  className?: string;
  showUpgrade?: boolean;
}

export function UsageMeter({ 
  metricName, 
  current, 
  limit, 
  tier, 
  className = '',
  showUpgrade = true 
}: UsageMeterProps) {
  const isUnlimited = limit === null;
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && current >= limit;

  const getProgressColor = () => {
    if (isAtLimit) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getNextTier = (currentTier: SubscriptionTier): SubscriptionTier | null => {
    if (currentTier === 'free') return 'pro';
    if (currentTier === 'pro') return 'featured';
    return null;
  };

  const nextTier = getNextTier(tier);
  const shouldShowUpgrade = showUpgrade && !isUnlimited && (isNearLimit || isAtLimit) && nextTier;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {metricName}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isUnlimited ? (
            <span className="text-green-600 dark:text-green-400 font-medium">Unlimited</span>
          ) : (
            `${current}/${limit}`
          )}
        </span>
      </div>

      {!isUnlimited && (
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
          
          {isAtLimit && (
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                You've reached your {metricName.toLowerCase()} limit.
              </AlertDescription>
            </Alert>
          )}

          {isNearLimit && !isAtLimit && (
            <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                You're approaching your {metricName.toLowerCase()} limit.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {shouldShowUpgrade && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-3">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Need more {metricName.toLowerCase()}?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Upgrade to {nextTier === 'pro' ? 'Pro' : 'MyEdtr Verified'} for {
                nextTier === 'featured' ? 'unlimited' : 'increased limits'
              }
            </p>
          </div>
          <Link href="/pricing" className="block w-full">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <ArrowUp className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 