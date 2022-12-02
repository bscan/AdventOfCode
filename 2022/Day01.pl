# Syntax highlighting looks better in vscode with the Perl Navigator extension

use v5.20;
use warnings;
use Data::Class;
use IO::All qw(io);

class Elf {
    use List::Util qw(sum);

    initvar text     : str;
    private calories : array[int];
    public total_cals: int;

    def _init( $self, $args ) {
        $self->calories = [ split( "\n", $args->{ text } ) ];
        $self->total_cals = sum( $self->calories->@* );
    }
}

class ElfClan {
    use List::Util qw(sum);

    private elves : array[Elf];
    initvar text  : str;

    def _init( $self, $args )   {
        $self->elves = [ map { Elf->new( text => $_ ) } split( "\n\n", $args->{ text } ) ];
    }

    def top_n_cals( $self, $n : int ) : int {
        my @calories = sort { $b <=> $a } map { $_->total_cals } $self->elves->@*;
        return sum( @calories[ 0 .. $n - 1 ] );
    }
}

my $input = io('/home/brian/workspace/aoc/day1.txt')->all();
my $elves = ElfClan->new( text => $input );
say $elves->top_n_cals(1);
say $elves->top_n_cals(3);
