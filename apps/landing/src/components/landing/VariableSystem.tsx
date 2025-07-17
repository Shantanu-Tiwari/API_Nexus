import { motion } from "framer-motion";

const mockVariables = `{
  "environments": {
    "development": {
      "base_url": "http://localhost:3000",
      "api_key": "dev_key_12345",
      "timeout": 5000
    },
    "staging": {
      "base_url": "https://staging-api.example.com",
      "api_key": "stg_key_67890",
      "timeout": 10000
    },
    "production": {
      "base_url": "https://api.example.com",
      "api_key": "{{PROD_API_KEY}}",
      "timeout": 15000
    }
  },
  "global": {
    "user_agent": "API-Workspace/1.0",
    "content_type": "application/json"
  }
}`;

export const VariableSystem = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Variables that actually work
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Environment switching in one click. Variables that sync across your entire workspace. 
              Because context switching kills flow.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Global and environment-specific variables</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Auto-complete in request builders</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Secure credential storage</span>
              </div>
            </div>
          </motion.div>

          {/* Right Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium">variables.json</span>
                </div>
              </div>
              <div className="p-4">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{mockVariables}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};