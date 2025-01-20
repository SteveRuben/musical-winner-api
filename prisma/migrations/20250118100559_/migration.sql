-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'OWNER';
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- CreateTable
CREATE TABLE "account_events" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "space_id" INTEGER,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "ip" TEXT,
    "browser" TEXT,
    "device" TEXT,
    "vendor" TEXT,
    "engine" TEXT,
    "os" TEXT,
    "os_version" TEXT,
    "engine_version" TEXT,
    "browser_version" TEXT,
    "req_url" TEXT,
    "user_agent" TEXT,
    "meta" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bio" TEXT,
    "expertise" TEXT[],
    "hourlyRate" DOUBLE PRECISION,
    "experience" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_camera_usage" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "account_id" INTEGER,
    "participant_id" INTEGER,
    "is_toggled_on" BOOLEAN NOT NULL,
    "toggled_at" TIMESTAMP(3) NOT NULL,
    "last_heartbeat_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_camera_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_mic_usage" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "account_id" INTEGER,
    "participant_id" INTEGER,
    "is_toggled_on" BOOLEAN NOT NULL,
    "toggled_at" TIMESTAMP(3) NOT NULL,
    "last_heartbeat_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_mic_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_room_participant_count" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "participant_count" INTEGER NOT NULL,
    "measured_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_room_participant_count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_room_usage" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "account_id" INTEGER,
    "participant_id" INTEGER,
    "began_at" TIMESTAMP(3) NOT NULL,
    "last_heartbeat_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_room_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_total_participant_counts" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "measured_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_total_participant_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "errors" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "http_code" INTEGER,
    "code" TEXT,
    "stack" TEXT,
    "message" TEXT,
    "tag" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_ratings" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "account_id" INTEGER,
    "room_id" INTEGER,
    "space_id" INTEGER,

    CONSTRAINT "experience_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_codes" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "meta" TEXT,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER,
    "content" TEXT,
    "sender_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant_states" (
    "account_id" INTEGER NOT NULL,
    "state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participant_states_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "room_id" INTEGER,
    "ip" TEXT,
    "browser" TEXT,
    "device" TEXT,
    "vendor" TEXT,
    "engine" TEXT,
    "os" TEXT,
    "os_version" TEXT,
    "engine_version" TEXT,
    "browser_version" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_memberships" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "began_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_participant_states" (
    "room_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_participant_states_pkey" PRIMARY KEY ("room_id","account_id")
);

-- CreateTable
CREATE TABLE "room_routes" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "route" TEXT NOT NULL,
    "priority_level" INTEGER NOT NULL DEFAULT 0,
    "is_vanity" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_states" (
    "room_id" INTEGER NOT NULL,
    "state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallpaper_id" INTEGER,

    CONSTRAINT "room_states_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "room_templates" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT,

    CONSTRAINT "room_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_widget_states" (
    "room_id" INTEGER NOT NULL,
    "widget_id" INTEGER NOT NULL,
    "state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_widget_states_pkey" PRIMARY KEY ("room_id","widget_id")
);

-- CreateTable
CREATE TABLE "room_widgets" (
    "widget_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_widgets_pkey" PRIMARY KEY ("widget_id","room_id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER,
    "url_id" TEXT,
    "is_public" BOOLEAN DEFAULT true,
    "display_name" TEXT,
    "template_name" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "secret" TEXT,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slack_actions" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "action" TEXT,
    "slack_user_id" TEXT,
    "channel_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slack_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slack_installs" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "workspace_id" TEXT,
    "enterprise_id" TEXT,
    "slack_user_id" TEXT,
    "install_data" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalled_at" TIMESTAMP(3),

    CONSTRAINT "slack_installs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallpapers" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "mimetype" TEXT,
    "category" TEXT,
    "artist_name" TEXT,
    "thumbnail_url" TEXT,
    "dominant_color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallpapers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "widget_states" (
    "widget_id" INTEGER NOT NULL,
    "state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "widget_states_pkey" PRIMARY KEY ("widget_id")
);

-- CreateTable
CREATE TABLE "widgets" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER,
    "_type" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" TEXT NOT NULL,
    "account_id" INTEGER,
    "survey_name" TEXT,
    "response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" TEXT NOT NULL,
    "account_id" INTEGER,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "dominant_color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_events_account_id_index" ON "account_events"("account_id");

-- CreateIndex
CREATE INDEX "account_events_browser_index" ON "account_events"("browser");

-- CreateIndex
CREATE INDEX "account_events_device_index" ON "account_events"("device");

-- CreateIndex
CREATE INDEX "account_events_engine_index" ON "account_events"("engine");

-- CreateIndex
CREATE INDEX "account_events_ip_index" ON "account_events"("ip");

-- CreateIndex
CREATE INDEX "account_events_key_index" ON "account_events"("key");

-- CreateIndex
CREATE INDEX "account_events_os_index" ON "account_events"("os");

-- CreateIndex
CREATE INDEX "account_events_session_id_index" ON "account_events"("space_id");

-- CreateIndex
CREATE INDEX "account_events_value_index" ON "account_events"("value");

-- CreateIndex
CREATE INDEX "account_events_vendor_index" ON "account_events"("vendor");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "analytics_camera_usage_account_id_participant_id_index" ON "analytics_camera_usage"("account_id", "participant_id");

-- CreateIndex
CREATE INDEX "analytics_camera_usage_is_toggled_on_index" ON "analytics_camera_usage"("is_toggled_on");

-- CreateIndex
CREATE INDEX "analytics_camera_usage_room_id_index" ON "analytics_camera_usage"("room_id");

-- CreateIndex
CREATE INDEX "analytics_camera_usage_toggled_at_index" ON "analytics_camera_usage"("toggled_at");

-- CreateIndex
CREATE INDEX "analytics_mic_usage_account_id_participant_id_index" ON "analytics_mic_usage"("account_id", "participant_id");

-- CreateIndex
CREATE INDEX "analytics_mic_usage_is_toggled_on_index" ON "analytics_mic_usage"("is_toggled_on");

-- CreateIndex
CREATE INDEX "analytics_mic_usage_room_id_index" ON "analytics_mic_usage"("room_id");

-- CreateIndex
CREATE INDEX "analytics_mic_usage_toggled_at_index" ON "analytics_mic_usage"("toggled_at");

-- CreateIndex
CREATE INDEX "analytics_room_participant_count_measured_at_index" ON "analytics_room_participant_count"("measured_at");

-- CreateIndex
CREATE INDEX "analytics_room_participant_count_participant_count_index" ON "analytics_room_participant_count"("participant_count");

-- CreateIndex
CREATE INDEX "analytics_room_participant_count_room_id_index" ON "analytics_room_participant_count"("room_id");

-- CreateIndex
CREATE INDEX "analytics_room_usage_account_id_participant_id_index" ON "analytics_room_usage"("account_id", "participant_id");

-- CreateIndex
CREATE INDEX "analytics_room_usage_began_at_last_heartbeat_at_index" ON "analytics_room_usage"("began_at", "last_heartbeat_at");

-- CreateIndex
CREATE INDEX "analytics_room_usage_room_id_index" ON "analytics_room_usage"("room_id");

-- CreateIndex
CREATE INDEX "analytics_total_participant_counts_count_index" ON "analytics_total_participant_counts"("count");

-- CreateIndex
CREATE INDEX "analytics_total_participant_counts_measured_at_index" ON "analytics_total_participant_counts"("measured_at");

-- CreateIndex
CREATE INDEX "errors_account_id_index" ON "errors"("account_id");

-- CreateIndex
CREATE INDEX "errors_http_code_index" ON "errors"("http_code");

-- CreateIndex
CREATE INDEX "errors_code_index" ON "errors"("code");

-- CreateIndex
CREATE INDEX "errors_tag_index" ON "errors"("tag");

-- CreateIndex
CREATE INDEX "experience_ratings_account_id_index" ON "experience_ratings"("account_id");

-- CreateIndex
CREATE INDEX "experience_ratings_rating_index" ON "experience_ratings"("rating");

-- CreateIndex
CREATE INDEX "experience_ratings_room_id_index" ON "experience_ratings"("room_id");

-- CreateIndex
CREATE INDEX "experience_ratings_space_id_index" ON "experience_ratings"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "magic_codes_code_key" ON "magic_codes"("code");

-- CreateIndex
CREATE INDEX "magic_codes_action_index" ON "magic_codes"("action");

-- CreateIndex
CREATE INDEX "magic_codes_account_id_index" ON "magic_codes"("account_id");

-- CreateIndex
CREATE INDEX "magic_codes_code_index" ON "magic_codes"("code");

-- CreateIndex
CREATE INDEX "messages_chat_id_index" ON "messages"("chat_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_index" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "participants_account_id_index" ON "participants"("account_id");

-- CreateIndex
CREATE INDEX "participants_browser_index" ON "participants"("browser");

-- CreateIndex
CREATE INDEX "participants_device_index" ON "participants"("device");

-- CreateIndex
CREATE INDEX "participants_engine_index" ON "participants"("engine");

-- CreateIndex
CREATE INDEX "participants_ip_index" ON "participants"("ip");

-- CreateIndex
CREATE INDEX "participants_os_index" ON "participants"("os");

-- CreateIndex
CREATE INDEX "participants_room_id_index" ON "participants"("room_id");

-- CreateIndex
CREATE INDEX "participants_vendor_index" ON "participants"("vendor");

-- CreateIndex
CREATE INDEX "room_memberships_account_id_index" ON "room_memberships"("account_id");

-- CreateIndex
CREATE INDEX "room_memberships_room_id_index" ON "room_memberships"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_routes_route_key" ON "room_routes"("route");

-- CreateIndex
CREATE INDEX "room_routes_room_id_priority_level_index" ON "room_routes"("room_id", "priority_level");

-- CreateIndex
CREATE INDEX "room_routes_route_index" ON "room_routes"("route");

-- CreateIndex
CREATE UNIQUE INDEX "room_templates_name_key" ON "room_templates"("name");

-- CreateIndex
CREATE INDEX "room_templates_creator_id_index" ON "room_templates"("creator_id");

-- CreateIndex
CREATE INDEX "room_templates_name_index" ON "room_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_widget_states_widget_id_key" ON "room_widget_states"("widget_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_widgets_widget_id_key" ON "room_widgets"("widget_id");

-- CreateIndex
CREATE INDEX "room_widgets_room_id_index" ON "room_widgets"("room_id");

-- CreateIndex
CREATE INDEX "room_widgets_widget_id_index" ON "room_widgets"("widget_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_url_id_key" ON "rooms"("url_id");

-- CreateIndex
CREATE INDEX "rooms_creator_id_index" ON "rooms"("creator_id");

-- CreateIndex
CREATE INDEX "rooms_deleted_at_index" ON "rooms"("deleted_at");

-- CreateIndex
CREATE INDEX "rooms_template_name_index" ON "rooms"("template_name");

-- CreateIndex
CREATE INDEX "rooms_url_id_index" ON "rooms"("url_id");

-- CreateIndex
CREATE INDEX "sessions_account_id_index" ON "sessions"("account_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_index" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_revoked_at_index" ON "sessions"("revoked_at");

-- CreateIndex
CREATE INDEX "sessions_secret_index" ON "sessions"("secret");

-- CreateIndex
CREATE INDEX "slack_actions_account_id_index" ON "slack_actions"("account_id");

-- CreateIndex
CREATE INDEX "slack_installs_account_id_index" ON "slack_installs"("account_id");

-- CreateIndex
CREATE INDEX "slack_installs_enterprise_id_index" ON "slack_installs"("enterprise_id");

-- CreateIndex
CREATE INDEX "slack_installs_workspace_id_index" ON "slack_installs"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallpapers_url_key" ON "wallpapers"("url");

-- CreateIndex
CREATE INDEX "wallpapers_creator_id_index" ON "wallpapers"("creator_id");

-- CreateIndex
CREATE INDEX "wallpapers_url_index" ON "wallpapers"("url");

-- CreateIndex
CREATE INDEX "widgets__type_index" ON "widgets"("_type");

-- CreateIndex
CREATE INDEX "widgets_archived_at_index" ON "widgets"("archived_at");

-- CreateIndex
CREATE INDEX "widgets_creator_id_index" ON "widgets"("creator_id");

-- CreateIndex
CREATE INDEX "widgets_deleted_at_index" ON "widgets"("deleted_at");

-- AddForeignKey
ALTER TABLE "account_events" ADD CONSTRAINT "account_events_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_events" ADD CONSTRAINT "account_events_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_camera_usage" ADD CONSTRAINT "analytics_camera_usage_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_camera_usage" ADD CONSTRAINT "analytics_camera_usage_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_camera_usage" ADD CONSTRAINT "analytics_camera_usage_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_mic_usage" ADD CONSTRAINT "analytics_mic_usage_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_mic_usage" ADD CONSTRAINT "analytics_mic_usage_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_mic_usage" ADD CONSTRAINT "analytics_mic_usage_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_room_participant_count" ADD CONSTRAINT "analytics_room_participant_count_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_room_usage" ADD CONSTRAINT "analytics_room_usage_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_room_usage" ADD CONSTRAINT "analytics_room_usage_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_room_usage" ADD CONSTRAINT "analytics_room_usage_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "errors" ADD CONSTRAINT "errors_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_ratings" ADD CONSTRAINT "experience_ratings_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_ratings" ADD CONSTRAINT "experience_ratings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_ratings" ADD CONSTRAINT "experience_ratings_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magic_codes" ADD CONSTRAINT "magic_codes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "widgets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_states" ADD CONSTRAINT "participant_states_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_memberships" ADD CONSTRAINT "room_memberships_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_memberships" ADD CONSTRAINT "room_memberships_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participant_states" ADD CONSTRAINT "room_participant_states_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participant_states" ADD CONSTRAINT "room_participant_states_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_routes" ADD CONSTRAINT "room_routes_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_states" ADD CONSTRAINT "room_states_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_states" ADD CONSTRAINT "room_states_wallpaper_id_fkey" FOREIGN KEY ("wallpaper_id") REFERENCES "wallpapers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_templates" ADD CONSTRAINT "room_templates_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_widget_states" ADD CONSTRAINT "room_widget_states_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_widget_states" ADD CONSTRAINT "room_widget_states_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "widgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_widgets" ADD CONSTRAINT "room_widgets_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "widgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_widgets" ADD CONSTRAINT "room_widgets_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slack_actions" ADD CONSTRAINT "slack_actions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slack_installs" ADD CONSTRAINT "slack_installs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallpapers" ADD CONSTRAINT "wallpapers_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widget_states" ADD CONSTRAINT "widget_states_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "widgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
