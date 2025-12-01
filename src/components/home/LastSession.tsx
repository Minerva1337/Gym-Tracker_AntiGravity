import { Card } from '../ui/Card';
import { Calendar, Trophy, RotateCcw, Trash2 } from 'lucide-react';
import { useTrainingHistory, useDeleteSession } from '../../lib/hooks/useActiveSession';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';

interface SessionListItemProps {
    session: {
        id: string;
        planId: string;
        planName: string;
        completedAt?: number;
        startedAt: number;
        totalSets: number;
        totalVolume: number;
    };
    onRepeat: (id: string) => void;
    onDelete: (id: string) => void;
}

function SessionListItem({ session, onRepeat, onDelete }: SessionListItemProps) {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-50, 0], [1, 0]); // Fade in delete button

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -100) {
            // Swiped far enough
        }
    };

    return (
        <div className="relative mb-4">
            {/* Delete Button Background */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 flex justify-end items-center pr-4 bg-destructive/10 rounded-xl"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/20 hover:text-destructive h-10 w-10 p-0"
                    onClick={() => onDelete(session.id)}
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
            </motion.div>

            {/* Foreground Card */}
            <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                onDragEnd={handleDragEnd}
                className="relative"
            >
                <Card className="bg-gradient-to-br from-bg-card to-primary/5 border-primary-glow/30 relative z-10 !bg-bg-card">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-lg mb-1">{session.planName}</h3>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Calendar className="w-3 h-3" />
                                <span>{session.completedAt ? new Date(session.completedAt).toLocaleDateString() : 'Unbekannt'}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRepeat(session.planId)}
                            className="text-primary hover:bg-primary/10"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Wiederholen
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="font-bold text-text-primary">{session.completedAt && session.startedAt ? Math.round((session.completedAt - session.startedAt) / 60000) : 0}</div>
                            <div className="text-[10px] text-text-muted uppercase">Min</div>
                        </div>
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="font-bold text-text-primary">{session.totalSets}</div>
                            <div className="text-[10px] text-text-muted uppercase">Sätze</div>
                        </div>
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="font-bold text-text-primary">{Math.round(session.totalVolume / 1000)}t</div>
                            <div className="text-[10px] text-text-muted uppercase">Volumen</div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export function LastSession() {
    const { data: history, isLoading } = useTrainingHistory();
    const deleteSession = useDeleteSession();
    const navigate = useNavigate();

    const handleRepeat = (planId: string) => {
        navigate(`/training?plan=${planId}`);
    };

    const handleDelete = async (sessionId: string) => {
        await deleteSession.mutateAsync(sessionId);
    };

    if (isLoading) {
        return <div className="text-center py-8 text-text-muted">Lade Historie...</div>;
    }

    if (!history || history.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-bg-card to-primary/5 border-primary-glow/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg">Letzte Trainings</h2>
                    <span className="text-xs font-medium text-text-muted bg-bg-elevated px-2 py-1 rounded-full">
                        Keine Daten
                    </span>
                </div>
                <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-bg-elevated mx-auto flex items-center justify-center mb-4">
                        <Trophy className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-text-secondary text-sm max-w-[200px] mx-auto">
                        Starte dein erstes Training, um hier deine Fortschritte zu sehen.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="font-heading font-semibold text-lg">Letzte Trainings</h2>

            {history.map((session) => (
                <SessionListItem
                    key={session.id}
                    session={session}
                    onRepeat={handleRepeat}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}
