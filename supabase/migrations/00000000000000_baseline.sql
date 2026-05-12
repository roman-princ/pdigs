


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."car_analytics_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "dealership_id" "uuid" NOT NULL,
    "car_id" "uuid" NOT NULL,
    "car_label" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "car_analytics_events_event_type_check" CHECK (("event_type" = ANY (ARRAY['impression'::"text", 'testDriveBooking'::"text", 'depositIntent'::"text"])))
);


ALTER TABLE "public"."car_analytics_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."car_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "dealership_id" "uuid" NOT NULL,
    "car_id" "uuid" NOT NULL,
    "car_label" "text" NOT NULL,
    "customer_name" "text" NOT NULL,
    "customer_email" "text" NOT NULL,
    "customer_phone" "text" NOT NULL,
    "preferred_date" "date" NOT NULL,
    "source" "text" DEFAULT 'test_drive_form'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."car_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cars" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "brand" "text" NOT NULL,
    "model" "text" NOT NULL,
    "year" integer DEFAULT (EXTRACT(year FROM "now"()))::integer NOT NULL,
    "price" numeric(65,30) DEFAULT 0 NOT NULL,
    "mileage" integer DEFAULT 0 NOT NULL,
    "fuel" "text" DEFAULT 'Petrol'::"text" NOT NULL,
    "transmission" "text" DEFAULT 'Automatic'::"text" NOT NULL,
    "power" integer DEFAULT 0 NOT NULL,
    "color" "text" DEFAULT ''::"text" NOT NULL,
    "condition" "text" DEFAULT 'New'::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "images" "text"[] DEFAULT ARRAY[]::"text"[],
    "features" "text"[] DEFAULT ARRAY[]::"text"[],
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dealership_id" "uuid" NOT NULL
);


ALTER TABLE "public"."cars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dealerships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "owner_email" "text" NOT NULL,
    "logo_url" "text",
    "primary_color" "text" DEFAULT '#2563eb'::"text" NOT NULL,
    "secondary_color" "text" DEFAULT '#f97316'::"text" NOT NULL,
    "hero_title" "text" DEFAULT 'Find Your Perfect Drive'::"text" NOT NULL,
    "hero_subtitle" "text" DEFAULT 'Browse our curated selection of premium vehicles.'::"text" NOT NULL,
    "phone" "text" DEFAULT ''::"text" NOT NULL,
    "address" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "about_us" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."dealerships" OWNER TO "postgres";


ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."car_analytics_events"
    ADD CONSTRAINT "car_analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."car_bookings"
    ADD CONSTRAINT "car_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cars"
    ADD CONSTRAINT "cars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dealerships"
    ADD CONSTRAINT "dealerships_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "dealerships_slug_key" ON "public"."dealerships" USING "btree" ("slug");



CREATE INDEX "idx_car_analytics_events_car_created" ON "public"."car_analytics_events" USING "btree" ("car_id", "created_at" DESC);



CREATE INDEX "idx_car_analytics_events_dealership_created" ON "public"."car_analytics_events" USING "btree" ("dealership_id", "created_at" DESC);



CREATE INDEX "idx_car_bookings_car_created" ON "public"."car_bookings" USING "btree" ("car_id", "created_at" DESC);



CREATE INDEX "idx_car_bookings_dealership_created" ON "public"."car_bookings" USING "btree" ("dealership_id", "created_at" DESC);



ALTER TABLE ONLY "public"."car_analytics_events"
    ADD CONSTRAINT "car_analytics_events_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."car_analytics_events"
    ADD CONSTRAINT "car_analytics_events_dealership_id_fkey" FOREIGN KEY ("dealership_id") REFERENCES "public"."dealerships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."car_bookings"
    ADD CONSTRAINT "car_bookings_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."car_bookings"
    ADD CONSTRAINT "car_bookings_dealership_id_fkey" FOREIGN KEY ("dealership_id") REFERENCES "public"."dealerships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cars"
    ADD CONSTRAINT "cars_dealership_id_fkey" FOREIGN KEY ("dealership_id") REFERENCES "public"."dealerships"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Anyone can create car bookings" ON "public"."car_bookings" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Anyone can insert analytics events" ON "public"."car_analytics_events" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Owner can delete dealership analytics events" ON "public"."car_analytics_events" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."dealerships" "d"
  WHERE (("d"."id" = "car_analytics_events"."dealership_id") AND ("d"."owner_email" = "auth"."email"())))));



CREATE POLICY "Owner can read dealership analytics events" ON "public"."car_analytics_events" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."dealerships" "d"
  WHERE (("d"."id" = "car_analytics_events"."dealership_id") AND ("d"."owner_email" = "auth"."email"())))));



CREATE POLICY "Owner can read dealership bookings" ON "public"."car_bookings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."dealerships" "d"
  WHERE (("d"."id" = "car_bookings"."dealership_id") AND ("d"."owner_email" = "auth"."email"())))));



ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."car_analytics_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."car_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cars" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."dealerships" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";



GRANT ALL ON TABLE "public"."car_analytics_events" TO "anon";
GRANT ALL ON TABLE "public"."car_analytics_events" TO "authenticated";
GRANT ALL ON TABLE "public"."car_analytics_events" TO "service_role";



GRANT ALL ON TABLE "public"."car_bookings" TO "anon";
GRANT ALL ON TABLE "public"."car_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."car_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."cars" TO "anon";
GRANT ALL ON TABLE "public"."cars" TO "authenticated";
GRANT ALL ON TABLE "public"."cars" TO "service_role";



GRANT ALL ON TABLE "public"."dealerships" TO "anon";
GRANT ALL ON TABLE "public"."dealerships" TO "authenticated";
GRANT ALL ON TABLE "public"."dealerships" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







