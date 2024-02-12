function formatChatTimestamp(isoString: string): string {
  const timestamp = new Date(isoString);
  const now = new Date();

  // Calculate the difference in hours
  const diffTime = Math.abs(now.getTime() - timestamp.getTime());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffHours < 24) {
    // Format as '03:33 PM'
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } else if (diffHours >= 24 && diffHours < 48) {
    return 'yesterday';
  } else {
    // Format as '23/12/23'
    return timestamp.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }
}

export default formatChatTimestamp;
