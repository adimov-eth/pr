// src/components/WebhookInstructions.js
export default function WebhookInstructions() {
  return (
    <div className="shadow overflow-hidden sm:rounded-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Webhook Setup Instructions</h2>
      <ol className="list-decimal list-inside space-y-2">
        <li>Go to your repository&apos;s settings on GitHub</li>
        <li>Click on &quot;Webhooks&quot; in the left sidebar</li>
        <li>Click &quot;Add webhook&quot;</li>
        <li>
          Set Payload URL to:{' '}
          <code className="bg-gray-900 p-1">{process.env.NEXTAUTH_URL}/api/webhook</code>
        </li>
        <li>
          Set Content type to: <code className="bg-gray-900 p-1">application/json</code>
        </li>
        <li>Select &quot;Let me select individual events&quot;</li>
        <li>Check only the &quot;Pull requests&quot; event</li>
        <li>Click &quot;Add webhook&quot; to save</li>
      </ol>
    </div>
  );
}
