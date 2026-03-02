import type { AccelSample, WorkoutState } from "./types";
import { TtsService } from "./TtsService";
import { HapticsService } from "./HapticsService";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private lastUpTime = 0;
  private lastRepTime = 0;
  private peak = 0;
  private valley = 0;
  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";

  // เพิ่ม Services เข้ามาใน Engine
  constructor(private tts: TtsService, private haptics: HapticsService) {}

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  start() {
    this.state = {
      status: "RUNNING",
      repDisplay: 0,
      stats: { repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0 },
    };
    this.phase = "WAIT_UP";
    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  async process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;

    const y = sample.ay;
    const side = Math.abs(sample.ax) + Math.abs(sample.az);

    // ค่า Threshold เหล่านี้ "ต้องไปปรับจูนหน้างานตอนรันบนมือถือจริง" นะครับ
    const UP_TH = 2.0; 
    const DOWN_TH = -1.5;
    const MIN_ROM = 3.0;
    const MIN_MS = 700;
    const MAX_MS = 3500;

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);
      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
        this.lastUpTime = sample.t;
      }
    } else {
      this.valley = Math.min(this.valley, y);

      if (y < DOWN_TH) {
        const repMs = sample.t - this.lastRepTime;
        this.lastRepTime = sample.t;
        this.state.stats.repsTotal++;

        const rom = this.peak - this.valley;

        let ok = true;
        let msg = "OK";

        // เช็คความถูกต้อง
        if (rom < MIN_ROM) {
          ok = false; msg = "ยกแขนต่ำเกินไป";
        } else if (repMs < MIN_MS) {
          ok = false; msg = "เร็วเกินไป";
        } else if (repMs > MAX_MS) {
          ok = false; msg = "ช้าเกินไป";
        } else if (side > 5) {
          ok = false; msg = "กรุณายกแนวตั้ง";
        }

        if (ok) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score++;
          this.state.stats.avgRepMs = Math.round((this.state.stats.avgRepMs + repMs) / 2);
          
          // ท่าถูก: สั่นแบบ Success และนับเลข
          this.haptics.success();
          this.tts.speak(this.state.repDisplay.toString());
        } else {
          this.state.stats.repsBad++;
          
          // ท่าผิด: สั่นเตือน และบอกว่าผิดเพราะอะไร
          this.haptics.warning();
          this.tts.speak(msg);
        }

        this.state.stats.lastMessage = msg;
        this.phase = "WAIT_UP";
        this.peak = 0;
        this.valley = 0;
        this.emit();
      }
    }
  }
}