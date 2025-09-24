# Install dependencies only when needed
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app
# Create the directory as root
RUN mkdir -p ./log 

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --cache .npm --legacy-peer-deps

# Copy the source code
COPY . .

# expose the git SHA and branch as env vars
# we use the same names that vercel uses for cross-compatibility in deployment
ARG NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
ARG NEXT_PUBLIC_CM_URL
ARG NEXT_PUBLIC_ADOBE_ANALYTICS_URL
ARG SENDGRID_API_KEY
ARG NEW_RELIC_API_KEY
ARG NEW_RELIC_APP_NAME
ARG NEW_RELIC_LICENSE_KEY
ARG RELEASE_STAGE

RUN npm run build

# RUNNER
FROM node:20-alpine AS runner


# Disable Next.js telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# We need to expose these ARG again, they are needed for browser monitor
ARG NEW_RELIC_APP_NAME
ARG NEW_RELIC_LICENSE_KEY
ENV NEW_RELIC_APP_NAME $NEW_RELIC_APP_NAME
ENV NEW_RELIC_LICENSE_KEY $NEW_RELIC_LICENSE_KEY

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

RUN mkdir -p /log
RUN chown -R nextjs:nodejs /log

USER nextjs

EXPOSE $PORT

RUN ls -a

ENTRYPOINT ["node", "server.js"]

CMD ["r", "@newrelic/next"]