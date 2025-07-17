import { motion } from "framer-motion";

const mockRequest = `{
  "method": "POST",
  "url": "/api/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  "body": {
    "name": "Alex Developer",
    "email": "alex@example.com"
  }
}`;

const mockResponse = `{
  "status": 201,
  "data": {
    "id": "usr_1234567890",
    "name": "Alex Developer",
    "email": "alex@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "metadata": {
    "response_time": "127ms",
    "server": "api-v2.example.com"
  }
}`;

export const RequestResponseFlow = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Grid pattern with radial gradient fade */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          mask: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          WebkitMask: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)'
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See it in action</h2>
          <p className="text-xl text-muted-foreground">Request → Response. That simple.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Request Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <div className="bg-muted rounded-lg border overflow-hidden">
              <div className="px-4 py-3 border-b bg-background">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium">Request Builder</span>
                </div>
              </div>
              <div className="p-4">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{mockRequest}</code>
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center lg:py-20"
          >
            <div className="text-2xl font-mono">→</div>
          </motion.div>

          {/* Response Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1"
          >
            <div className="bg-muted rounded-lg border overflow-hidden">
              <div className="px-4 py-3 border-b bg-background">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium">Response Viewer</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">201</span>
                </div>
              </div>
              <div className="p-4">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{mockResponse}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};