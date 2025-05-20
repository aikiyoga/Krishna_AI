class ConversationMemory:
    def __init__(self):
        self.sessions = {}

    def get(self, session_id):
        return self.sessions.get(session_id, [])

    def update(self, session_id, query, response):
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        self.sessions[session_id].append({"query": query, "response": response})